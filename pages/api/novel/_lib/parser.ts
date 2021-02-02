import { NextApiRequest } from "next/types";
import { parse } from "url";

export function parseRequest(req: NextApiRequest) {
    console.log("HTTP " + req.url);
    const { query } = parse(req.url || "/", true);
    const { title, author } = query || {};

    if (Array.isArray(title)) {
        throw new Error("Expected a single title");
    }
    if (Array.isArray(author)) {
        throw new Error("Expected a single author");
    }

    return {
        title: title ? decodeURIComponent(title) : null,
        author,
    };
}
