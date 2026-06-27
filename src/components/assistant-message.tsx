interface AssistantMessageProps {
    text: string;
}

export function AssistantMessage({ text }: AssistantMessageProps) {
    return (
      <box flexDirection="row" alignItems="center" padding={1}>
        <text>{text}</text>
      </box>
    );
  }