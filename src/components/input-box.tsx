import { InputRenderable } from "@opentui/core";
import { ChatCompletionMessageParam } from "openai/resources";
import { useRef } from "react";
import { Spinner } from "./spinner";

interface InputBoxProps {
    loading: boolean;
    history: ChatCompletionMessageParam[];
    setHistory: (history: ChatCompletionMessageParam[]) => void;
    setLoading: (loading: boolean) => void;
    chat: (messages: ChatCompletionMessageParam[]) => Promise<string>;
}

export function InputBox({ loading, history, setHistory, setLoading, chat }: InputBoxProps) {
    const inputRef = useRef<InputRenderable>(null);

    async function handleSubmit(value: string) {
        if (value === "/clear") {
            setHistory([]);

            if (inputRef.current) inputRef.current.value = "";

            return;
        }

        if (value === "/exit") {
            if (inputRef.current) inputRef.current.value = "";

            return process.exit(0);
        }

        if (value === "/help") {
            if (inputRef.current) inputRef.current.value = "";

            return console.log("Help");
        }

        if (value === "/settings") {
            if (inputRef.current) inputRef.current.value = "";

            return console.log("Settings");
        }

        const prompt = value.trim();

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

    return (<box flexGrow={0} flexDirection="column" gap={1}>
        {loading ? <Spinner /> : null}
        <box flexDirection="row" backgroundColor="black">
            <text>{"> "}</text>
            <box flexGrow={1}>
                <input
                    ref={inputRef}
                    focused
                    placeholder={"Ask me anything..."}
                    onSubmit={(value) => {
                        if (typeof value === "string") void handleSubmit(value);
                    }}
                />
            </box>
        </box>
    </box>
    );
}