import { RGBA, SyntaxStyle } from "@opentui/core";

// https://opentui.com/docs/components/markdown/
// https://opentui.com/docs/components/code/#markdown-styles
const markdownSyntaxStyle = SyntaxStyle.fromStyles({
    "markup.heading": { fg: RGBA.fromHex("#58A6FF"), bold: true },
    "markup.bold": { fg: RGBA.fromHex("#F0F6FC"), bold: true },
    "markup.italic": { fg: RGBA.fromHex("#F0F6FC"), italic: true },
    "markup.list": { fg: RGBA.fromHex("#FF7B72") },
    "markup.raw": { fg: RGBA.fromHex("#A5D6FF") },
    "markup.link": { fg: RGBA.fromHex("#58A6FF"), underline: true },
    default: { fg: RGBA.fromHex("#E6EDF3") },
});

interface ChatAssistantMessageProps {
    text: string;
    backgroundColor?: string;
}

export function ChatAssistantMessage({ text, backgroundColor="transparent" }: ChatAssistantMessageProps) {
    return (
        <box width="100%" flexShrink={1} maxWidth="100%" backgroundColor={backgroundColor}>
            <markdown
                content={text}
                syntaxStyle={markdownSyntaxStyle}
                width="100%"
                flexShrink={1}
                maxWidth="100%"
                tableOptions={{
                    style: "grid",
                    widthMode: "full",
                    columnFitter: "balanced",
                    wrapMode: "word",
                    cellPaddingX: 2,
                    cellPaddingY: 1,
                    borders: true,
                }}
            />
        </box>
    );
}
