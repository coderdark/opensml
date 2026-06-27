export function Footer() {
    return (<box flexDirection="row"
        backgroundColor="black"
        gap={2}
        padding={1}
        flexShrink={0}
        flexGrow={0}
        borderStyle="single"
        borderColor="gray">
        <text fg="#CC8400">/Clear</text>
        <text fg="#CC8400">/Exit</text>
        <text fg="#CC8400">/Help</text>
        <text fg="#CC8400">/Settings</text>
    </box>
    );
}