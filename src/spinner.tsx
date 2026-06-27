import { useEffect, useState } from "react";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function Spinner({ label = "Thinking" }: { label?: string }) {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setFrame((i) => (i + 1) % FRAMES.length);
        }, 80);

        return () => clearInterval(id);
    }, []);

    return <text fg={'orange'}>
        {`${FRAMES[frame]} ${label}...`}
    </text>;
}