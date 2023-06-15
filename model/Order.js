import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema({
    customer_id:{
        type: Schema.Types.ObjectId,
        required: true
    },
    book_id:{
        type: Schema.Types.ObjectId,
        required: true
    },
    initial_date:{
        type: Date,
        required: true
    },
    delivery_date:{
        type: Date,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;