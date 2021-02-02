import { NextApiRequest, NextApiResponse } from "next/types";
import { createCanvas, registerFont, CanvasRenderingContext2D } from "canvas";
import path from "path";
import { parseRequest } from "./_lib/parser";

const ogpHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
        const { title, author } = parseRequest(req);
        const file = createOgp(title, author);
        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": file.length,
            "Cache-Control": `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`,
        });
        res.end(file, "binary");
    } catch (e) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/html");
        res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
        console.error(e);
    }
};

const createOgp = (title: string, author: string): Buffer => {
    const WIDTH = 1200 as const;
    const HEIGHT = 630 as const;
    const DX = 0 as const;
    const DY = 0 as const;
    const canvas = createCanvas(WIDTH, HEIGHT);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f9f9fa";
    ctx.fillRect(DX, DY, WIDTH, HEIGHT);

    const PADDING = 80 as const;
    const LINE_HEIGHT = 80 as const;

    registerFont(path.resolve("./fonts/NotoSerifJP-Black.otf"), {
        family: "logo",
    });
    registerFont(path.resolve("./fonts/NotoSansJP-Black.otf"), {
        family: "title",
    });
    registerFont(path.resolve("./fonts/NotoSansJP-Light.otf"), {
        family: "id",
    });
    ctx.fillStyle = "rgba(75, 85, 99, 1)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "32px logo";
    ctx.fillText("Clara", 600, 50);

    ctx.fillStyle = "#000000";
    ctx.font = "64px title";

    const lineWidth = WIDTH - PADDING * 2;
    const titleLines = splitByMeasureWidth(title, lineWidth, ctx);
    const titleLinesLen = titleLines.length;
    const titleHeight = titleLinesLen * LINE_HEIGHT;
    const startLine = Math.floor(315 + (LINE_HEIGHT - titleHeight) / 2);

    titleLines.forEach((line, i) => {
        ctx.fillText(line, 600, startLine + i * LINE_HEIGHT);
    });

    ctx.fillStyle = "rgba(75, 85, 99, 1)";
    ctx.font = "36px id";
    ctx.fillText(`@${author}`, 600, 580);

    return canvas.toBuffer("image/png");
};

const splitByMeasureWidth = (text: string, maxWidth: number, context: CanvasRenderingContext2D) => {
    const chars = Array.from(text);
    let line = "";
    let lines = [];
    for (const char of chars) {
        if (maxWidth <= context.measureText(line + char).width) {
            lines.push(line);
            line = char;
        } else {
            line += char;
        }
    }
    lines.push(line);
    return lines;
};

export default ogpHandler;
