import { ChatCompletionMessageParam } from "openai/resources";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";

interface BodyProps {
    history: ChatCompletionMessageParam[];
}

export function Body({ history }: BodyProps) {
    return (
        <scrollbox
        flexGrow={1}
        style={{
          contentOptions: { padding: 1, flexDirection: "column", gap: 2 },
          scrollbarOptions: {
            showArrows: true,
            trackOptions: {
              foregroundColor: "gray",
              backgroundColor: "black",
            },
          },
        }}>
        <box>
          {history
            .filter((m) => m.role !== "system")
            .map((m, i) => {
              const text = typeof m.content === "string" ? m.content : "";

              if (m.role === "user") {
                return <UserMessage key={i} text={text} />;
              }

              return <AssistantMessage key={i} text={text} />;
            })}
        </box>
      </scrollbox>
    );
}