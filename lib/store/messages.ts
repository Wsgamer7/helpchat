import { create } from "zustand";

export type Imessage = {
  created_at: string;
  id: string;
  img_path: string | null;
  reci_id: string;
  send_id: string;
  text: string | null;
  profiles: {
    avatar_url: string;
    email: string | null;
    full_name: string;
    id: string;
  } | null;
};

interface MesssagesState {
  messages: Imessage[];
  addMessage: (message: Imessage) => void;
  addStr2LastMessage: (str: string) => void;
  getLastConent: () => string;
}

export const useMessage = create<MesssagesState>()((set, get) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  addStr2LastMessage: (str: string) =>
    set((state) => {
      const newMessages = [...state.messages];
      const oldLastMessage = newMessages[newMessages.length - 1];
      const newLastMessage = {
        ...oldLastMessage,
        text: oldLastMessage.text + str,
      };
      newMessages[newMessages.length - 1] = newLastMessage;
      return { messages: newMessages };
    }),
  getLastConent: () => {
    const { messages } = get();
    if (messages.length === 0) {
      return ""; // 或任何其他默认值
    }
    return messages[messages.length - 1].text!;
  },
}));
