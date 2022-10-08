import fetch from 'node-fetch'

export async function call_compta_api(type, route, body = null){
    try {
        const response = await fetch(`${process.env.COMPTA_API}/${route}`, {
            method: type,
            responseType: "json",
            body: body,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.e30.57liIDu_0WkNYVluL15dPGT93TYxzckQ7r4VRhi-a9M"
            }
        });
        const data = await response.json()
        if (response.status >= 400 && response.status < 600) {
            throw new Error(`Error Microservice Accounting : ${data.error} : ${data.message}`);
        }
        return data 
    } catch (error){
        throw Error(error);
    }
}

export async function create_accounting_transaction(){
    const body = {
        account: "",
        name: "",
        description: "",
        value: 0,
        eventId: 0,
        valueDate: 0
    }
    return call_compta_api('POST', `accounting_transactions`, body);
}

export async function get_stock(productId){
    return call_compta_api('GET', `stocks/${productId}`);
}

export async function update_stock(products){
    const body = {
        description: `Remove ${products.length} products`,
        date: Date.now(),
        products: products,
    }
    return call_compta_api('POST', `stocks`, JSON.stringify(body));
}

export async function update_stock_of_products(products){
    const products_stock = products.map((product) => {
        return {
            id: product.id,
            deltaQuantity: -product.quantity
        }
    });

    return await update_stock(products_stock);
}
export async function get_products_from_id(productId) {
    return await call_compta_api('GET', `products/${productId}`);
}

export async function get_products_and_check_stocks(products){
        let stocks = [];
        for ( const index in products){
            const product = products[index];

            const product_detail = await get_products_from_id(product.id);
            const stock = await get_stock(product.id);

            if (product.quantity > stock.stock.remainingQuantity) 
                throw new Error(`Product "${stock.stock.product.name}" a has only ${stock.stock.remainingQuantity} remaining quantity.`);
            
            stocks.push({
                ...product_detail.product,
                stock: stock.stock.remainingQuantity,
                quantity_wanted: product.quantity
            })
            console.log(stocks)
        }

        return stocks;
}