import { existsSync } from 'node:fs';
import { mkdir, appendFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'date-fns';
import crypto from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logDirectory = join(__dirname, '..', 'logs');

const dataLog = async (message, filename) => {
    const uuid = crypto.randomUUID();
    const dateTime = format(new Date(), 'yy/MM/dd HH:mm:ss');
    const logEntry = `${dateTime}\t${uuid}\t${message}\n`;
    try {
        if (!existsSync(logDirectory)) {
            await mkdir(logDirectory, { recursive: true });
        }
        await appendFile(join(logDirectory, filename), logEntry);
    } catch (error) {
        console.error('Failed to write log:', error);
    }
};

const logger = (req, res, next) => {
    dataLog(`${req.method === 'GET' ? `\tGET` : req.method}\t${req.headers.origin === undefined ? `\tno headers.origin` : req.headers.origin}\t\t${req.url}`, 'requestLog.txt');
    next();
}

export { dataLog, logger }

