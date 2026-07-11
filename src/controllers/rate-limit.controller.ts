import { Request, Response } from "express";
import { rateLimitService } from "../services/rate-limit.service";

export const checkRateLimit = async (req: Request, res: Response) => {
    try{const { clientKey } = req.body;

        const result = await rateLimitService.check(clientKey);

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}