import { NextApiRequest, NextApiResponse } from "next";
import { createCanvas, registerFont } from "canvas";
import path from "path";

const createOgp = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const WIDTH = 1200 as const;
    const HEIGHT = 630 as const;
    const DX = 0 as const;
    const DY = 0 as const;
    const canvas = createCanvas(WIDTH, HEIGHT);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f9f9fa";
    ctx.fillRect(DX, DY, WIDTH, HEIGHT);

    registerFont(path.resolve("./fonts/NotoSansJP-Black.otf"), {
        family: "title",
    });
    registerFont(path.resolve("./fonts/NotoSansJP-Light.otf"), {
        family: "id",
    });
    ctx.font = "72px title";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("小説のタイトル", 600, 300);

    ctx.font = "36px id";
    ctx.fillText("作者のID", 600, 500);

    const buffer = canvas.toBuffer();

    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buffer.length,
    });
    res.end(buffer, "binary");
};

export default createOgp;
