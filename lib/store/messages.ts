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
}

export const useMessage = create<MesssagesState>()((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
