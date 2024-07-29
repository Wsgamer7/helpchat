export default function Welcome() {
  const textMsg1 = {
    heading: "拒绝邀请",
    content: "对方邀请我约会，怎样拒绝但不被讨厌",
  };
  const imgMsg1 = { heading: "发聊天截图", content: "发图，然后得到回复建议" };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="mt-[10%] font-bold">
        <h1 className="text-5xl text-primary mb-3">你好</h1>
        <h1 className="text-4xl text-gray-300 bold">问我任何聊天套路</h1>
      </div>
      <div className="flex gap-5 mb-3">
        <div className="flex-1">
          <Card heading={textMsg1.heading} content={textMsg1.content} />
        </div>
        <div className="flex-1">
          <Card heading={imgMsg1.heading} content={imgMsg1.content} />
        </div>
      </div>
    </div>
  );
}

function Card({ heading, content }: { heading: string; content: string }) {
  return (
    <div className="h-full cursor-pointer rounded-lg border  bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900">
      <div className="text-sm font-semibold">{heading}</div>
      <div className="text-sm text-zinc-600">{content}</div>
    </div>
  );
}
