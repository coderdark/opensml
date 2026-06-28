import { useState } from "react";
import fs from "node:fs";
import { useKeyboard } from "@opentui/react";

type FocusedField = "baseURL" | "apiKey" | "model";

const fields: FocusedField[] = ["baseURL", "apiKey", "model"];

interface SettingsProps {
    onSave: (onSave: boolean) => void;
}

export default function Settings({ onSave }: SettingsProps) {
    const [baseURL, setBaseURL] = useState("");
    const [apiKey, setAPIKey] = useState("");
    const [model, setModel] = useState("");
    const [focused, setFocused] = useState<FocusedField>("baseURL");

    useKeyboard((key) => {
        if (key.name !== "tab") return;

        setFocused((current) => {
            const index = fields.indexOf(current);

            if (key.shift) {
                return fields[(index - 1 + fields.length) % fields.length];
            }

            return fields[(index + 1) % fields.length];
        });
    });

    function saveSettings() {
        try {
            const settings = { baseURL, apiKey, model };

            fs.writeFileSync(".env", `BASE_URL=${baseURL}\nAPI_KEY=${apiKey}\nMODEL=${model}`);

            process.env.BASE_URL = baseURL;
            process.env.API_KEY = apiKey;
            process.env.MODEL = model;

            onSave(true);
        } catch (error) {
            console.error(error);

            onSave(false);
        }
    }

    return (
        <box flexGrow={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            backgroundColor="black">
            <box flexDirection="column" justifyContent="center" alignItems="center" width="100%" gap={1} >
                <ascii-font font="tiny" text="OpenSLM" color="orange" />
                <text>Your SML (Small Language Model) CLI</text>
                <text fg="orange">Settings</text>
            </box>
            <box borderStyle="single" borderColor="gray" width="30%">
                <input value={baseURL} onInput={setBaseURL} placeholder="Enter your base URL" focused={focused === "baseURL"} />
            </box>
            <box borderStyle="single" borderColor="gray" width="30%">
                <input value={apiKey} onInput={setAPIKey} placeholder="Enter your API key" focused={focused === "apiKey"} />
            </box>
            <box borderStyle="single" borderColor="gray" width="30%">
                <input value={model} onInput={setModel} placeholder="Enter your model name" focused={focused === "model"} onSubmit={saveSettings} />
            </box>
            <box onMouseDown={() => saveSettings()} backgroundColor="orange" width="10%" justifyContent="center" alignItems="center" marginTop={1}>
                <text>Save</text>
            </box>
        </box>
    );
}