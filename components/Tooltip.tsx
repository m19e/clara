import { useState, useRef } from "react";
import Popper from "popper.js";

export default function Tooltip({ d }: { d: string }) {
    const [tooltipShow, setTooltipShow] = useState(false);
    const btnRef = useRef(null);
    const tooltipRef = useRef(null);
    const openLeftTooltip = () => {
        new Popper(btnRef.current, tooltipRef.current, {
            placement: "left",
        });
        setTooltipShow(true);
    };
    const closeLeftTooltip = () => {
        setTooltipShow(false);
    };

    return (
        <svg
            className="w-full h-8 transition opacity-50 hover:opacity-70 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ref={btnRef}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
        </svg>
    );
}
