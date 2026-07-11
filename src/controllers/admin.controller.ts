import { Request, Response } from "express";
import { adminService } from "../services/admin.service";

export const createOrUpdateConfig = async (req: Request, res: Response) => {
    try{
        const config = await adminService.createConfigorUpdateConfig(req.body);

        return res.status(201).json({ 
            message: "Config created or updated successfully", 
            config
        });
    } catch (error) {
        return res.status(400).json({
            error: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};

export const getAllConfigs = async (req: Request, res: Response) => {
    try{
        const configs = await adminService.getAllConfigs();
        return res.status(200).json({
            message: "Configs fetched successfully",
            configs
        });
    } catch (error) {
        return res.status(400).json({
            error: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};

export const getConfig = async (req: Request, res: Response) => {
    try{
        const config = await adminService.getConfig(req.params.clientKey as string);
        return res.status(200).json({
            message: "Config fetched successfully",
            config
        });
    } catch (error) {
        return res.status(400).json({
            error: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};

export const deleteConfig = async (req: Request, res: Response) => {
    try{
        await adminService.deleteConfig(req.params.clientKey as string);
        return res.status(200).json({
            message: "Config deleted successfully",
        });
    } catch (error) {
        return res.status(400).json({
            error: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};

export const deleteAllConfigs = async (req: Request, res: Response) => {
    try{
        await adminService.deleteAllConfigs();
        return res.status(200).json({
            message: "All configs deleted successfully",
        });
    } catch (error) {
        return res.status(400).json({
            error: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};