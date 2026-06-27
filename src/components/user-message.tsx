interface UserMessageProps {
    text: string;
}

export function UserMessage({ text }: UserMessageProps) {
    return (
        <box flexDirection="row" alignItems="center" backgroundColor="gray">
            <text>{'> '}</text>
            <text>{text}</text>
        </box>
    );
}