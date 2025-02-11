import { createContext, useContext } from "react";

export class ScrollController {
  private scrollToBottom: boolean = true;

  pauseScrollToBottom() {
    this.scrollToBottom = false;
  }

  unpauseScrollToBottom() {
    this.scrollToBottom = true;
  }

  shouldScrollToBottom() {
    return this.scrollToBottom;
  }
}

export const ScrollControllerContext = createContext<ScrollController | null>(
  null
);

export function useScrollController() {
  const context = useContext(ScrollControllerContext);
  if (!context) {
    throw new Error(
      "useScrollController must be used within a ScrollControllerProvider"
    );
  }
  return context;
}
