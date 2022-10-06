require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { main } = require("./mail");

const app = express();
const corsOption = {
	origin: ["https://premiermart.ml", "http://localhost:5173"],
};
app.use(cors(corsOption));
app.use(express.json());

app.post("/email", async (req, res) => {
	const { name, number, orderItems, total } = req.body;
	console.log("OrderItmes from req.body: ", orderItems);
	try {
		const info = await main({ name, number, orderItems, total });
		console.log("Info from main function", info);
		res.status(200).json({ success: "email sent" });
	} catch (error) {
		res.status(400).json({ error: "authentication failed" });
		console.log(error);
	}
});
app.get("/", (req, res) => {
	res.status(200).json({ status: "working" });
});

app.listen(process.env.PORT, () => {
	console.log("Listening to port", process.env.PORT);
});
