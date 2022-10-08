import express from 'express';
import { body } from 'express-validator';
import { get_transactions_all, post_abandon_transaction, post_payment_transaction } from '../controllers/transaction_controller';
import { validate } from '../validator';

const router = express.Router();

router.get('/transactions/:user_id', get_transactions_all);

router.post('/payment', validate([
    body('user_id').notEmpty().withMessage("User ID is missing."),
    body('products').isArray().notEmpty(),
    body('products.*.id').notEmpty().withMessage("ID of one product is missing."),
    body('products.*.quantity').notEmpty().withMessage("quantity of one product is missing."),
    body('payment').isObject().notEmpty(),
    body('payment.type').notEmpty().withMessage("Payment type is missing"),
]), post_payment_transaction);

router.post('/abandon', validate([
    body('user_id').notEmpty().withMessage("User ID is missing."),
    body('amount').notEmpty().isNumeric().withMessage("Amount is missing or is not numeric."),
]), post_abandon_transaction)

module.exports = router;