interface ChatHeaderProps {
    title: string;
    subtitle: string;
}

export function ChatHeader({ title, subtitle }: ChatHeaderProps) {
    return (
        <box padding={1}
            border={["bottom"]}
            borderColor="gray"
            borderStyle="single"
            gap={1}
            backgroundColor="black"
            flexGrow={1}
            flexShrink={0}>
            <ascii-font font="tiny" text={title} color="orange" />
            <text>
                {subtitle}
            </text>
        </box>
    );
}