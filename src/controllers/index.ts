import {Request, Response, NextFunction as Next} from "express";
import jobs from "../jobs";
import scrapper from "../services/scrapper";
import toCSV from "../utils/toCSV";

export default {
    async create(req: Request, res: Response, next: Next) {
        try {
            const filename = await jobs.push();
            return res.status(201).send({
                status: "OK",
                filename,
            });
        }catch(e) {
            return next(e);
        }
    }
}