import { TextareaRenderable, type KeyBinding } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import { ChatCompletionMessageParam } from "openai/resources";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./spinner";
import { OpenAI } from "openai";

export type TokenUsage = {
    prompt: number;
    completion: number;
};

export const emptyTokenUsage: TokenUsage = { prompt: 0, completion: 0 };

const textareaKeyBindings: KeyBinding[] = [
    { name: "return", action: "submit" },
    { name: "kpenter", action: "submit" },
    { name: "return", shift: true, action: "newline" },
    { name: "kpenter", shift: true, action: "newline" },
];

interface InputBoxProps {
    loading: boolean;
    history: ChatCompletionMessageParam[];
    setHistory: (history: ChatCompletionMessageParam[]) => void;
    setLoading: (loading: boolean) => void;
    openai: OpenAI;
    model: string;
}

export function InputBox({ loading, history, setHistory, setLoading, openai, model }: InputBoxProps) {
    const [seconds, setSeconds] = useState(0);
    const inputRef = useRef<TextareaRenderable>(null);
    const renderer = useRenderer();

    async function chat(messages: ChatCompletionMessageParam[]) {
        const response = await openai.chat.completions.create({
            model,
            messages,
            stream: false,
        });

        return response.choices[0].message.content;
    }

    function clearInput() {
        inputRef.current?.clear();
    }

    function getInputValue() {
        return inputRef.current?.plainText ?? "";
    }

    async function handleSubmit(value: string) {
        if (loading) return;
        
        const prompt = value.trim();

        if (prompt === "/clear") {
            setHistory([]);
            clearInput();

            return;
        }

        if (prompt === "/exit") {
            clearInput();

            renderer.destroy();

            return process.exit(0);
        }

        if (prompt === "/settings") {
            clearInput();

            return console.log("Settings");
        }

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

    return (<box flexGrow={1} flexShrink={0} flexDirection="column">
        <box flexDirection="row" paddingLeft={1} paddingRight={1} paddingTop={1}>
            {loading ? <Spinner /> : <text fg="orange">Response time [{seconds}s]</text>}
        </box>
        <box flexDirection="row" flexGrow={1} flexShrink={0} padding={1}>
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
                    keyBindings={textareaKeyBindings}
                    onSubmit={() => {
                        void handleSubmit(getInputValue());
                    }}
                />
            </box>
        </box>
    </box>
    );
}