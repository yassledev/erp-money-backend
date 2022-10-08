
import models from '../models';
import services from '../services';

export async function get_transactions_all(req, res){
    const { user_id } = req.params;
    try {
        const transactions = await services.Transaction.get_user_transactions(user_id);
        return res.status(200).send({ status: 200, success: true, data: transactions });
    } catch (error) {
        return res.status(400).send({ status: 400, success: false, data: error.message });
    }
}

export async function post_payment_transaction(req, res){
    const { user_id, products, payment } = req.body;
    try {
        const transaction = await services.Transaction.pay(user_id, products, payment);
        return res.status(201).send({ status: 201, success: true, data: transaction });
    } catch(error){
        return res.status(400).send({ status: 400, success: false, data: error.message });
    }
}

/* Add / Sub money to user */
export async function post_abandon_transaction(req, res){
    const { user_id, amount } = req.body;
    try {
        const transaction = await services.Transaction.abandon(user_id, amount);
        return res.status(201).send({ status: 201, success: true, data: transaction });
    } catch(error){
        return res.status(400).send({ status: 400, success: false, data: error.message });
    }
}
