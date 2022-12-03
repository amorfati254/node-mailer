require('dotenv').config();

import express from 'express';
import cors from 'cors';
import { sendMail } from './mail';
import { createOrder } from './order';

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
export type Order = {
	userID: string;
	name: string;
	number: string;
	orderItems: OrderItem[];
	total: number;
};
export type OrderItem = {
	name: string;
	price: number;
	quantity: number;
	id: string;
};
type ReqBody = Order;
app.post<never, ResBody, ReqBody>('/order', async (req, res) => {
	const order = req.body;
	console.log('OrderItems from req.body: ', order.orderItems);
	try {
		const sent = await createOrder(order);
		if (sent) {
			const info = await sendMail(order);
			console.log('Info from main function', info);
		} else {
			throw new Error('failed to create order in sanity');
		}
		res.status(200).json({ success: 'email sent' });
	} catch (error) {
		if (error instanceof Error) {
			res.status(400).json({ error: error.message });
		}
		console.log(error);
	}
});
app.get<never, ResBody>('/', (req, res) => {
	res.status(200).json({ status: 'working' });
});

app.listen(process.env.PORT, () => {
	console.log('Listening to port', process.env.PORT);
});
