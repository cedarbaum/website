export type Chip = {
  message: string;
  label: string;
};

export type Message = {
  id: number;
  text?: string;
  html?: string;
  role: "user" | "assistant" | "system" | "canned";
  isTyping?: boolean;
  type?: "text" | "image" | "html" | "error";
  chips?: Chip[];
};
