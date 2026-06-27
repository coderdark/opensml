interface UserMessageProps {
    text: string;
}

export function UserMessage({ text }: UserMessageProps) {
    return (
        <box flexDirection="row" alignItems="center" backgroundColor="gray" borderStyle="single" borderColor="gray">
            <text>{'>'} </text>
            <text>{text}</text>
        </box>
    );
}