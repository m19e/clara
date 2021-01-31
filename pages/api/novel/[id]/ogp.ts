import { NextApiRequest, NextApiResponse } from "next";
import { createCanvas } from "canvas";

const createOgp = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const WIDTH = 1200 as const;
    const HEIGHT = 630 as const;
    const DX = 0 as const;
    const DY = 0 as const;
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#FFF";
    ctx.fillRect(DX, DY, WIDTH, HEIGHT);

    const buffer = canvas.toBuffer();

    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buffer.length,
    });
    res.end(buffer, "binary");
};

export default createOgp;
