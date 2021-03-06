import { useState, useRef, ReactNode } from "react";
import Popper from "popper.js";

type Props = {
    text: string;
    children: ReactNode;
};

const Tooltip = ({ text, children }: Props) => {
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
            <div className="w-10 h-10 mt-2 editor-bg rounded-full shadow-md flex-center">
                <div onMouseEnter={openLeftTooltip} onMouseLeave={closeLeftTooltip} ref={btnRef}>
                    {children}
                </div>
            </div>
            <div
                className={(tooltipShow ? "" : "hidden ") + "editor-bg mr-4 block z-50 no-underline break-words rounded-xl border border-solid border-gray-300"}
                ref={tooltipRef}
            >
                <div className="writing-v-rl opacity-70 font-semibold p-3 mb-0">
                    <p>{text}</p>
                </div>
            </div>
        </>
    );
};

export default Tooltip;
