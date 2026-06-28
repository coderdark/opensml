import { useEffect, useState } from "react";

const FRAMES = ["⠋ T", "⠙ Th", "⠹ Thi", "⠸ Thin", "⠼ Think", "⠴ Thinki", "⠦ Thinkin", "⠧ Thinking.", "⠇ Thinking..", "⠏ Thinking..."];

export function Spinner() {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setFrame((i) => (i + 1) % FRAMES.length);
        }, 80);

        return () => clearInterval(id);
    }, []);

    return <text fg={'orange'}>
        {`${FRAMES[frame]}`}
    </text>;
}