require('dotenv').config();

import express from 'express';
import cors from 'cors';
import { main } from './mail';

const app = express();
const corsOption = {
	origin: [
		'https://premiermart.ml',
		'http://localhost:5173',
		'http://192.168.31.208',
	],
};
app.use(cors(corsOption));
app.use(express.json());
type ResBody = { success: string } | { error: string } | { status: string };
type ReqBody = {
	name: string;
	number: string;
	orderItems: any[];
	total: number;
};
app.post<never, ResBody, ReqBody>('/email', async (req, res) => {
	const { name, number, orderItems, total } = req.body;
	console.log('OrderItmes from req.body: ', orderItems);
	try {
		const info = await main({ name, number, orderItems, total });
		console.log('Info from main function', info);
		res.status(200).json({ success: 'email sent' });
	} catch (error) {
		res.status(400).json({ error: 'authentication failed' });
		console.log(error);
	}
});
app.get<never, ResBody>('/', (req, res) => {
	res.status(200).json({ status: 'working' });
});

app.listen(process.env.PORT, () => {
	console.log('Listening to port', process.env.PORT);
});
