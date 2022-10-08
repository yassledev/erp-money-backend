import models from "../models";
import services from './index';
import { get_all_student } from "./student_service";

export async function get_user_transactions(user_id){
    try {
        const transactions = await models.Transaction.find({ user_id });
        if (transactions.length == 0){
            await services.Student.get_student_by_id(user_id)
        }
        return transactions
    } catch (error){
        throw new Error(error);
    }
}

export async function abandon(user_id, amount){
    try {
        const student = await services.Student.get_student_by_id(user_id);
        if(services.Student.is_membership(student))
            await services.Student.add_money_to_student(student.id, amount) 
        else 
            throw new Error("The user is not a member of an association.") 
        return student.balance + amount;
    } catch (error){
        throw Error(error);
    }
}

export async function insert_payment(student, products, price, payment){
    try {
        const transaction = models.Transaction({
            user_id: student.id,
            products: products,
            price: price,
            payment_type: payment.type,
            date: Date.now()
        });
        
        if(payment.type == "member")
            await services.Student.subtract_money_to_student(student.id, price)
        await services.Accounting.update_stock_of_products(products);
        await transaction.save(); 
        return transaction
    } catch (error){
        throw Error(error);
    }
}

export function check_payment(student, products, payment, price) {
    switch(payment.type){
        case "cash":
            return cash_payment()
        case "card":
            return bank_card_payment(price, payment.token);
        case "member":
            return student_card_payment(price, student);
        default:
            throw Error("We do not support this method of payment.")
    }
}

export function cash_payment(price, amount){
    return true;
}

export function bank_card_payment(price, token){
    if(Math.random() > 0.95)
        throw Error("Payment refused: the bank refused the transaction");
}

export function student_card_payment(price, student){
    if(price > student.balance)
        throw Error("Payment refused: the user does not have enough money on his member card");
}


export function get_total_price_of_products(student, products){
    if(services.Student.is_membership(student))
        return products.reduce((price, product) => price + (product.priceSub * product.quantity_wanted), 0);
    else
        return products.reduce((price, product) => price + (product.price * product.quantity_wanted), 0);
}

export async function pay(user_id, products, payment){
    try {
        const student = await services.Student.get_student_by_id(user_id);
        const products_details = await services.Accounting.get_products_and_check_stocks(products);
        const price = get_total_price_of_products(student, products_details);    
        check_payment(student, products, payment, price)
        const products_formatted = products_details.map(product => {
            return {
                id: product.id,
                name: product.name,
                unit_price: product.price,
                quantity: product.quantity_wanted
            }
        });
        const payment_db = await insert_payment(student, products_formatted, price, payment);
        return payment_db
    } catch (error){
        throw new Error(error);
    }
}
