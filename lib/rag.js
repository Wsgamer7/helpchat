// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs-hunyuan");

const HunyuanClient = tencentcloud.hunyuan.v20230901.Client;

// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
// 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRETID,
    secretKey: process.env.TENCENT_SECRETKEY,
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "hunyuan.tencentcloudapi.com",
    },
  },
};
// 实例化要请求产品的client对象,clientProfile是可选的
const client = new HunyuanClient(clientConfig);

export async function getAnswer(text, img_url) {
  let params;
  if (img_url == "") {
    params = {
      Model: "hunyuan-role",
      Messages: [
        {
          Role: "system",
          Content:
            "你是一个恋爱高手，你的职责教用户回复聊天对象, 你的回答应该是简单的，简短的",
        },
        {
          Role: "user",
          Content: text,
        },
      ],
    };
  } else {
    params = {
      Model: "hunyuan-vision",
      Messages: [
        {
          Role: "system",
          Content:
            "你是一个恋爱高手，你的职责教用户回复聊天对象, 你的回答应该是简单的，简短的,下面我发聊天记录和图片，你给个回复建议",
        },
        {
          Role: "user",
          Contents: [
            {
              Type: "image_url",
              Text: "这是我和意中人的聊天记录截图，怎样才能让他/她喜欢我呢？",
              ImageUrl: {
                Url: img_url,
              },
            },
          ],
        },
      ],
    };
  }

  try {
    const res = await client.ChatCompletions(params);
    console.log(res.Choices[0].Message.Content);
    return res.Choices[0].Message.Content;
  } catch (err) {
    console.error("error", err);
    throw err;
  }
}

export async function getStreamAnswer(text) {
  const encoder = new TextEncoder();
  console.log("now streaming");
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let params = {
          Model: "hunyuan-role",
          Stream: true,
          Messages: [
            {
              Role: "system",
              Content:
                "你是一个恋爱高手，你的职责教用户回复聊天对象, 你的回答应该是简单的，简短的",
            },
            {
              Role: "user",
              Content: text,
            },
          ],
        };
        const aiStream = await client.ChatCompletions(params);
        for await (const chunk of aiStream) {
          const data = JSON.parse(chunk.data);
          const content = data.Choices[0].Delta.Content || "";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
          );
        }
        controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: error.message })}\n\n`
          )
        );
        controller.close();
      }
    },
  });
  return stream;
}
