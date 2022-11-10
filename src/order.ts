import { client } from './client';
import { Order } from './server';
interface SanityOrderItem {
	_key: string;
	_type: string;
	quantity: number;
	product: { _type: string; _ref: string };
}
export const createOrder = async (data: Order) => {
	let sent = false;
	const localOrderItems: SanityOrderItem[] = [];
	data.orderItems.map(({ id, quantity }, i) => {
		localOrderItems.push({
			_key: Math.random().toString(36).slice(2, 7),
			_type: 'orderItem',
			quantity,
			product: { _type: 'reference', _ref: id },
		});
	});
	const order = {
		_type: 'order',
		name: data.name,
		phone: data.number,
		orderStatus: 'pending',
		orderDate: new Date().toJSON().slice(0, 10),
		total: data.total,
		orderItems: localOrderItems,
	};
	try {
		const response = await client.create(order);
		console.log(
			'🚀 ~ file: createOrder.ts ~ line 36 ~ response order sent',
			response._id
		);
		sent = true;
	} catch (error) {
		sent = false;
		console.error(error);
	}
	return sent;
};
