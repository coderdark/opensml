import { TextareaRenderable } from "@opentui/core";
import { ChatCompletionMessageParam } from "openai/resources";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./spinner";

interface InputBoxProps {
    loading: boolean;
    history: ChatCompletionMessageParam[];
    setHistory: (history: ChatCompletionMessageParam[]) => void;
    setLoading: (loading: boolean) => void;
    chat: (messages: ChatCompletionMessageParam[]) => Promise<string>;
}

export function InputBox({ loading, history, setHistory, setLoading, chat }: InputBoxProps) {
    const [seconds, setSeconds] = useState(0);
    const inputRef = useRef<TextareaRenderable>(null);

    function clearInput() {
        inputRef.current?.clear();
    }

    function getInputValue() {
        return inputRef.current?.plainText ?? "";
    }

    async function handleSubmit(value: string) {
        if (value === "/clear") {
            setHistory([]);

            clearInput();

            return;
        }

        if (value === "/exit") {
            clearInput();

            return process.exit(0);
        }

        if (value === "/help") {
            clearInput();

            return console.log("Help");
        }

        if (value === "/settings") {
            clearInput();

            return console.log("Settings");
        }

        const prompt = value.trim();

        if (!prompt || loading) return;

        const next: ChatCompletionMessageParam[] = [...history, { role: "user", content: prompt }];

        setHistory(next);
        setLoading(true);

        clearInput();

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

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setSeconds(seconds + 1);
            }, 1000);

            return () => clearInterval(interval);
        }

    }, [loading, seconds]);

    return (<box flexGrow={1} flexDirection="column">
        <box flexDirection="row" padding={1}>
            {loading ? <Spinner /> : <text fg="orange">Response time [{seconds}s]</text>}
        </box>
        <box flexDirection="row" flexGrow={1} padding={1}>
            <text>{"> "}</text>
            <box flexGrow={1}>
                <textarea
                    ref={inputRef}
                    backgroundColor="black"
                    textColor="white"
                    focusedBackgroundColor="black"
                    focusedTextColor="white"
                    focused
                    placeholder={"Ask me anything..."} 
                    onSubmit={() => {
                        void handleSubmit(getInputValue());
                    }}
                    onKeyDown={(e) => {
                        if (e.name === "return" && !e.shift) {
                            void handleSubmit(getInputValue());
                        }
                    }}
                />
            </box>
        </box>
    </box>
    );
}