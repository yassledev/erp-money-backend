import mongoose, { mongo, Schema } from 'mongoose';


const TransactionModel = new Schema({
    user_id: { type: Number },
    products: { type: Array },
    price: { type: Number },
    payment_type: { type: String },
    date: { type: Date },
});

module.exports = mongoose.model('Transaction', TransactionModel);
