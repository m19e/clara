import React, { useState, useEffect, useRef } from "react";
// eslint-disable-next-line
import ScrollBar from "react-perfect-scrollbar";
// eslint-disable-next-line
import "react-perfect-scrollbar/dist/css/styles.css";

const styles = {
    example: {
        width: "600px",
        height: "600px",
    },
    content: {
        width: "900px",
        height: "360px",
        display: "flex",
        flexDirection: "column",
    },
};

const logEvent = (type) => console.log(`event ${type} triggered!`);

const debounce = (fn, ms = 0) => {
    let timeoutId;
    return function wrapper(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

const ScrollTest = () => {
    const [cName, setCName] = useState("");
    const [onXReachEnd, setOnXReachEnd] = useState(null);
    const [items, setItems] = useState(Array.from(new Array(100).keys()));

    useEffect(() => {
        setTimeout(() => {
            setCName("dummy");
            setOnXReachEnd(() => logEvent("onXReachEnd"));
        }, 5000);
    }, []);

    const handleYReachEnd = () => {
        logEvent("onYReachEnd");
    };

    const handleTrigger = () => {
        setItems(Array.from(new Array(100).keys()));
    };

    const handleSync = debounce((ps) => {
        ps.update();
        console.log("debounce sync ps container in 1000ms");
    }, 1000);

    return (
        <React.Fragment>
            <div style={styles.example}>
                <ScrollBar
                    className={cName}
                    onScrollY={() => logEvent("onScrollY")}
                    onScrollX={() => logEvent("onScrollX")}
                    onScrollUp={() => logEvent("onScrollUp")}
                    onScrollDown={() => logEvent("onScrollDown")}
                    onScrollLeft={() => logEvent("onScrollLeft")}
                    onScrollRight={() => logEvent("onScrollRight")}
                    onYReachStart={() => logEvent("onYReachStart")}
                    onYReachEnd={handleYReachEnd}
                    onXReachStart={() => logEvent("onXReachStart")}
                    onXReachEnd={onXReachEnd}
                    component="div"
                >
                    <div style={styles.content} />
                </ScrollBar>
            </div>
            <div style={styles.example}>
                <button onClick={handleTrigger}>Trigger</button>
                <ScrollBar onSync={handleSync}>
                    {items.map((e) => (
                        <div key={e}>{e}</div>
                    ))}
                </ScrollBar>
            </div>
        </React.Fragment>
    );
};

const data = Array.from(new Array(15).keys());
const directionObj = {};

const ScrollTop = () => {
    const ps = useRef();
    const [direction, setDirection] = useState("◇");

    const scrollTop = () => {
        const curr = ps.current;
        if (curr) {
            curr.scrollTop = 0;
        }
    };

    const onMouseWheel = (e) => {
        // const curr = ps.current;
        // if (curr) {
        // console.log("Top: ", curr.scrollTop);
        // console.log("Left: ", curr.scrollLeft);
        // }
        if (ps.current) {
            ps.current.scrollLeft -= e.deltaY;
        }

        const { deltaX, deltaY, deltaZ } = e;

        console.log(`X(${deltaX})Y(${deltaY})Z(${deltaZ})`);

        if (deltaX != 0) {
            setDirection(deltaX > 0 ? "→" : "←");
            return;
        }
        if (deltaY != 0) {
            setDirection(deltaY > 0 ? "↓" : "↑");
            return;
        }
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* <button onClick={scrollTop}>Scroll Top</button> */}
            <div>
                <h2 style={{ width: "100%", textAlign: "center" }}>wheel direction {direction}</h2>
                <div style={styles.example}>
                    <ScrollBar containerRef={(el) => (ps.current = el)} onWheel={onMouseWheel}>
                        <div style={styles.content}>
                            {data.map((e) => (
                                <div key={"000000000" + e} style={{ width: "100%", textAlign: "center" }}>
                                    {"これはテスト用テキストですこれはテスト用テキストです"}
                                </div>
                            ))}
                        </div>
                    </ScrollBar>
                </div>
            </div>
        </div>
    );
};

export default ScrollTop;
