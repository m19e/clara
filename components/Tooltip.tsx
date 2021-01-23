import { useState, useRef } from "react";
import Popper from "popper.js";

type TooltipProps = {
    text: string;
    d: string;
    classOverride?: string;
    fill?: "none" | string;
    stroke?: "currentColor" | string;
    viewBox?: "0 0 24 24" | string;
};

export default function Tooltip({ text, d, classOverride = "", fill = "none", stroke = "currentColor", viewBox = "0 0 24 24" }: TooltipProps) {
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
        <>
            <svg
                className={classOverride === "" ? "w-full h-8 transition-opacity opacity-50 hover:opacity-70 cursor-pointer" : classOverride}
                xmlns="http://www.w3.org/2000/svg"
                fill={fill}
                viewBox={viewBox}
                stroke={stroke}
                onMouseEnter={openLeftTooltip}
                onMouseLeave={closeLeftTooltip}
                ref={btnRef}
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
            </svg>
            <div
                className={(tooltipShow ? "" : "hidden ") + "editor-bg mr-2 block z-50 no-underline break-words rounded-xl border border-solid border-gray-300"}
                ref={tooltipRef}
            >
                <div className="writing-v-rl opacity-70 font-semibold p-3 mb-0">
                    <p>{text}</p>
                </div>
            </div>
        </>
    );
}
