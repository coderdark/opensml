interface ChatUserMessageProps {
    text: string;
    backgroundColor?: string;
}

export function ChatUserMessage({ text, backgroundColor = "#333333" }: ChatUserMessageProps) {
    return (
        <box flexDirection="row"
            alignItems="center"
            backgroundColor={backgroundColor}
            width="100%"
            flexShrink={0}
            maxWidth="100%"
            style={{
                flexShrink: 0,
                maxWidth: "100%"
            }}>
            <text>{'> '}</text>
            <text>{text}</text>
        </box>
    );
}