import { InputRenderable } from "@opentui/core";
import { ChatCompletionMessageParam } from "openai/resources";
import { useRef } from "react";
import { Spinner } from "./spinner";

interface FooterProps {
    loading: boolean;
    history: ChatCompletionMessageParam[];
    setHistory: (history: ChatCompletionMessageParam[]) => void;
    setLoading: (loading: boolean) => void;
    chat: (messages: ChatCompletionMessageParam[]) => Promise<string>;
}

export function Footer({ loading, history, setHistory, setLoading, chat }: FooterProps) {
    const inputRef = useRef<InputRenderable>(null);

    async function submit(prompt: string) {
        prompt = prompt.trim();

        if (!prompt || loading) return;

        const next: ChatCompletionMessageParam[] = [...history, { role: "user", content: prompt }];

        setHistory(next);
        setLoading(true);

        if (inputRef.current) inputRef.current.value = "";

        try {
            const reply = await chat(next);

            setHistory([...next, { role: "assistant", content: reply ?? "" }]);
        } catch (e) {
            const err = e instanceof Error ? e.message : "Request failed";

            setHistory([...next, { role: "assistant", content: `Error: ${err}` }]);
        } finally {
            setLoading(false);
        }
    }

    return (<>
        <box padding={1}>
            {loading ? <Spinner /> : null}
        </box>
        <box flexDirection="row" padding={1} backgroundColor="black">
            <text>{"> "}</text>
            <box flexGrow={1}>
                <input
                    ref={inputRef}
                    focused
                    placeholder={"Ask me anything..."}
                    onSubmit={(value) => {
                        const prompt = typeof value === "string" ? value : (inputRef.current?.value ?? "");
                        void submit(prompt);
                    }}
                />
            </box>
        </box>
    </>
    );
}