interface UserMessageProps {
    text: string;
}

export function UserMessage({ text }: UserMessageProps) {
    return (
        <box flexDirection="row" alignItems="center" backgroundColor="#222222">
            <text>{'> '}</text>
            <text>{text}</text>
        </box>
    );
}