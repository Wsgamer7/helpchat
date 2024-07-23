import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import Compressor from "compressorjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timestampForFile() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

export function getFileExtension(file: File): string | undefined {
  const fileName = file.name;
  const extension = fileName.split(".").pop();
  return extension === fileName ? undefined : extension;
}

export async function callAiApi(text: string, img_url: string) {
  try {
    const response = await fetch("/api/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, img_url }),
    });
    const data = await response.json();
    const botId = "4d9e91ca-f832-4bb4-b1fc-feee388d6a4e";
    const botAvatarUrl =
      "https://zsiyhbzzkskdywvuzasy.supabase.co/storage/v1/object/sign/avatars/public/chengge.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL3B1YmxpYy9jaGVuZ2dlLnBuZyIsImlhdCI6MTcyMTYxMDY3MywiZXhwIjoxNzUzMTQ2NjczfQ._MqxTKDPpvxESy9iePrWcgYaC8-ZZfS9jyyCuoUbWho&t=2024-07-22T01%3A11%3A14.524Z";
    const newMessage = {
      id: uuidv4(),
      text: data.text,
      send_id: botId,
      reci_id: "1",
      img_path: null,
      created_at: new Date().toISOString(),
      profiles: {
        id: "1",
        full_name: "bot",
        avatar_url: botAvatarUrl,
        email: null,
      },
    };
    return newMessage;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6, // Adjust the quality as needed
      success(result) {
        // Create a new File from the Blob result
        const compressedFile = new File([result], file.name, {
          type: result.type,
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      },
      error(err) {
        reject(err);
      },
    });
  });
}
