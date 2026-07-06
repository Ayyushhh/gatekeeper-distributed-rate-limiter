import { Request, Response } from "express";
import { rateLimitService } from "../services/rate-limit.service";

export const checkRateLimit = (req: Request, res: Response) => {
    const { clientKey } = req.body;

    const result = rateLimitService.check(clientKey);

    res.json(result);
}