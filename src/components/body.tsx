import { ChatCompletionMessageParam } from "openai/resources";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";
import { useEffect, useRef } from "react";
import { ScrollBoxRenderable } from "@opentui/core";

interface BodyProps {
  history: ChatCompletionMessageParam[];
  loading: boolean;
}

export function Body({ history, loading }: BodyProps) {
  const scrollRef = useRef<ScrollBoxRenderable>(null);

  useEffect(() => {
    const scrollbox = scrollRef.current;

    if (!scrollbox) return;

    scrollbox.scrollTop = Math.max(0, scrollbox.scrollHeight - scrollbox.viewport.height);
  }, [history, loading]);

  return (
    <box flexGrow={1} flexDirection="column" paddingLeft={1} paddingRight={1}>
      <scrollbox
        stickyScroll={true}
        stickyStart={"bottom"}
        ref={scrollRef}
        style={{
          contentOptions: { flexDirection: "column", gap: 1 },
          scrollbarOptions: {
            showArrows: true,
            trackOptions: {
              foregroundColor: "gray",
              backgroundColor: "black",
            },
          },
        }}>
        {history
          .filter((m) => m.role !== "system")
          .map((m, i) => {
            const text = typeof m.content === "string" ? m.content : "";

            if (m.role === "user") {
              return <UserMessage key={i} text={text} />;
            }

            return <AssistantMessage key={i} text={text} />;
          })}
      </scrollbox>
    </box>
  );
}