import { Request, Response, NextFunction } from 'express';
import * as fs from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'date-fns';
import crypto from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logDirectory = join(__dirname, '..', 'logs');

const dataLog = async (message: string, filename: string) => {
    const uuid = crypto.randomUUID();
    const dateTime = format(new Date(), 'yy/MM/dd HH:mm:ss');
    const logEntry = `${dateTime}\t${uuid}\t${message}\n`;
    try {
        if (!fs.existsSync(logDirectory)) {
            await fs.promises.mkdir(logDirectory, { recursive: true });
        }
        await fs.promises.appendFile(join(logDirectory, filename), logEntry);
    } catch (error) {
        console.error('Failed to write log:', error);
    }
};

const logger = (req: Request, _res: Response, next: NextFunction) => {
    const clean = (v: unknown) =>
        String(v ?? '').replace(/[\r\n\t]/g, ' ').slice(0, 500);
    const method = req.method;
    const origin = req.headers.origin ? clean(req.headers.origin) : '-';
    const url = clean(req.url);
    dataLog(`${method}\t${origin}\t${url}`, 'requestLog.txt');
    next();
};


export { dataLog, logger }

