'use strict';
import nodemailer from 'nodemailer';
import { Order, OrderItem } from './server';
const orderTemplate = (orderItems: OrderItem[]) => {
	let orders = '';
	orderItems.map((order, i) => {
		orders =
			orders +
			`<div style="box-shadow: 10px 10px 5px #9ca3af;padding:25px; margin:10px; border: 1px solid #9ca3af; border-radius: 5px; color: black;"><p style="font-size: 15px;text-align: center"; width: fit-content><b>ORDER ITEM : </b>${
				i + 1
			}</p>
			<p><b>Name:</b> ${order.name}</p>
			<p><b>Price:</b> ${order.price}</p>
			<p><b>Quantity:</b> ${order.quantity}</p></div>`;
	});
	// console.log("order in orderTemplate: ", orders);
	return orders;
};
// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (data: Order) => {
	const order = orderTemplate(data.orderItems);
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.titan.email',
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: process.env.USER,
			pass: process.env.PASS,
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: process.env.USER, // sender address
		to: 'mrwnmhmd123@gmail.com', // list of receivers
		subject: 'New Order Received', // Subject line
		text: 'New Order received', // plain text body
		html:
			'<div style="background-color: white; color: black;">' +
			'<div style="padding:20px;"><p style="text-align: center; font-size: 20px"><b>NEW ORDER</b></p>' +
			`<p><b>Name :</b> ${data.name}</p>` +
			`<p><b>Number :</b> ${data.number}</p>` +
			`<p><b>Total :</b> Ksh. ${data.total}</p>` +
			`<div style="text-align:center;padding:15px;margin:10px;background-color:#65a30d;border: 1px solid #65a30d; border-radius: 25px;width: fit-content"><a href="https://wa.me/254${data.number}" style="color: white;text-decoration: none">Send Whatsapp message</a></div></div>` +
			order +
			'</div>',
	});

	console.log('Message sent: %s', info.messageId);

	return info;
};
export { sendMail };
