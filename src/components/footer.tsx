export interface FooterProps {
    model: string;
}

export function Footer({ model }: FooterProps) {
    return (<box flexDirection="row"
        justifyContent="space-between"
        backgroundColor="black"
        gap={2}
        paddingLeft={1}
        flexShrink={0}
        flexGrow={0}
        borderStyle="single"
        borderColor="gray">
        <box flexDirection="row" gap={2}>
            <text>Commands:</text>
            <text fg="#CC8400">/clear</text>
            <text fg="#CC8400">/exit</text>
            <text fg="#CC8400">/settings</text>
        </box>
        <box flexDirection="row" gap={2}>
            <text>Model:</text>
            <text fg="#CC8400">{model}</text>
        </box>
    </box>
    );
}