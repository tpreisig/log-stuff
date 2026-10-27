import express, { Router, Request, Response } from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { logger, dataLog } from '../middleware/logEvents.js';
import { EventEmitter } from 'events';

const router: Router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

router.use(logger);

class UserInput extends EventEmitter { };
const userInput = new UserInput();

userInput.on('submit', (message) => dataLog(message, 'inputData.txt'));

// GET routes
router.get('/', (_req: Request, res: Response) => {
    res.sendFile(join(__dirname, '..', 'views', 'index.html'));
})

router.get('/price', (_req: Request, res: Response) => {
    res.sendFile(join(__dirname, '..', 'views', 'price.html'));
})

router.get('/theme', (_req: Request, res: Response) => {
    res.sendFile(join(__dirname, '..', 'views', 'theme.html'))
})

// POST routes
router.post('/theme', (req, res) => {
    userInput.emit('submit', `MacBooK M5, Price: ${req.body['price'] === undefined ? 'not requested' : '$' + req.body['price']}\tTheme Color: ${req.body['color'] === undefined ? 'not specified' : req.body['color']} `);
    res.redirect('/');

})
router.post('/price', (req, res) => {
    userInput.emit('submit', `MacBooK M5, Price: ${req.body['price'] === undefined ? 'not requested' : '$' + req.body['price']}\t\t\tTheme Color: ${req.body['color'] === undefined ? 'not specified' : req.body['color']} `);
    res.redirect('/');
})

export default router;

