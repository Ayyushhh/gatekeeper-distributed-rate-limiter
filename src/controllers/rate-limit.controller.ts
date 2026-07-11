import { Request, Response } from "express";
import { rateLimitService } from "../services/rate-limit.service";

export const checkRateLimit = async (req: Request, res: Response) => {
    try {
        const { clientKey } = req.body;

        const result = await rateLimitService.check(clientKey);

        res.setHeader(
            "X-RateLimit-Limit",
            result.limit.toString(),
        );

        res.setHeader(
            "X-RateLimit-Remaining",
            result.remaining.toString(),
        );

        res.setHeader(
            "X-RateLimit-Reset",
            Math.ceil(result.resetAt / 1000).toString(),
        );

        if (!result.allowed) {
            res.setHeader(
                "Retry-After",
                Math.max(
                    0,
                    Math.ceil((result.resetAt - Date.now()) / 1000),
                ).toString(),
            );

            return res.status(429).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};
