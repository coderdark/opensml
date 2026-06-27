interface AssistantMessageProps {
    text: string;
}

export function AssistantMessage({ text }: AssistantMessageProps) {
    return (
      <box flexDirection="row" alignItems="center">
        <text>{text}</text>
      </box>
    );
  }