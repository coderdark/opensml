interface HeaderProps {
    title: string;
    subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
    return (
        <box padding={1} gap={1} backgroundColor="black" flexGrow={0} flexShrink={0}>
            <ascii-font font="tiny" text={title} color="orange" />
            <text>
                {subtitle}
            </text>
        </box>
    );
}