import fs from 'fs';

export class Cart {
    constructor(id, products) {
        this.id = id;
        this.products = products;
    }
}

export class CartManager {
    constructor() {
        this.path = 'carts.json';
    }

    async readCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Hubo un error al intentar leer la lista de producto:', error);
        }
    }

    async addCart() {
        try {
            const listCarts = await this.readCarts();
            let autoId = listCarts.length + 1;
            const findCid = listCarts.find(cart => cart.id === autoId);
            if (findCid) {
                autoId = autoId + 1;
            }
            const newCart = new Cart(autoId, []);
            listCarts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(listCarts));
            return newCart;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductsFromCart(id) {
        const listCarts = await this.readCarts();
        try {
            const cart = listCarts.find(cart => cart.id === id);
            return cart.products;
        } catch (error) {
            console.log('Hubo un error a obtener los productos del carrito', error);
        }
    }

    async addProductToCart(cid, pid) {
        const listCarts = await this.readCarts();
        const cart = listCarts.find(cart => cart.id === cid);
        try {
            if (cart) {
                const product = cart.products.find(item => item.product === pid);
                if (product) {
                    product.quantity++;
                } else {
                    const newProductToCart = {
                        "product": pid,
                        "quantity": 1,
                    };
                    cart.products.push(newProductToCart);
                }
                await fs.promises.writeFile(this.path, JSON.stringify(listCarts));
            } else {
                console.log('El carrito no existe, pero se creo uno nuevo');
                await this.addCart(cid);
                await this.addProductToCart(cid, pid);
            }
            return cart;
        } catch (error) {
            console.log('Hubo un error al agregar el producto al carrito', error);
        }
    }
}