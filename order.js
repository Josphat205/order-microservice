import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Order from './model/Order.js';
import axios from 'axios';
import cors from 'cors';
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://jloman200:jloman200@cluster0.jvqbyb6.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// order book
app.post('/order', async (req, res) => {
    const order = new Order({
        book_id: new mongoose.Types.ObjectId(req.body.bookId),
        customer_id: new mongoose.Types.ObjectId(req.body.customerId),
        initial_date: req.body.initialDate,
        delivery_date: req.body.deliveryDate
    });
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

});

// get all orders
app.get('/order', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get order by id
app.get('/order/:id', async(req, res) => {
    try {
       const order = await Order.findById(req.params.id);
        if (order == null) {
            return res.status(404).json({ message: 'Order not found!!' });
        }
        const book = await axios.get(`https://book-service-kn2l.onrender.com/books/${order.book_id}`);
        const customer = await axios.get(`https://customer-service-w7xa.onrender.com/customers/${order.customer_id}`);
        res.order = {
            _id: order._id,
            book_title: book.data.title,
            book_author: book.data.author,
            customer_name: customer.data.name,
            initial_date: order.initial_date,
            delivery_date: order.delivery_date
        };
        res.json(res.order);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


  app.listen(5000, () => console.log(`Book service listening on port ${5000}`));