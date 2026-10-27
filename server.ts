import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import router from './routes/route.js';
import * as fs from 'node:fs';
import https from 'https';

const PORT = process.env.PORT_ASSIGNMENT || 3232;
const __dirname = dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use((req: Request, res: Response) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
})

const options = {
    key: fs.readFileSync('certificates/localhost-key.pem'),
    cert: fs.readFileSync('certificates/localhost.pem')
}

https.createServer(options, app).listen(PORT, () => {
    console.log(`Application running on 'https://localhost:${PORT}'.`);
})


