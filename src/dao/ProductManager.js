import fs from 'fs';

export class Product {
    constructor(id, title, description, code, price, status, stock, category, thumbnail) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnail = thumbnail;
    }
}

export class ProductManager {
    constructor() {
        this.path = 'products.json';
    }

    async readProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Hubo un error al intentar leer la lista de producto:', error);
        }
    }

    async addProduct(title, description, code, price, status, stock, category, thumbnail) {
        let messageStatus = 'Producto cargado correctamente.';
        try {
            const listProduct = await this.readProducts();
            const findProduct = listProduct.find(product => product.code === code);
            if (!findProduct) {
                let autoId = listProduct.length + 1;
                const findPid = listProduct.find(product => product.id === autoId);
                if (findPid) {
                    autoId = autoId + 1;
                }
                const newProduct = new Product(autoId, title, description, code, price, status, stock, category, thumbnail);
                listProduct.push(newProduct);
                await fs.promises.writeFile(this.path, JSON.stringify(listProduct));
            } else {
                messageStatus = `El producto ${findProduct.code} ya existe en la lista`;
            }
            return messageStatus;
        } catch (error) {
            console.log(error);
        }
    }

    async getProducts(limit) {
        try {
            const products = await this.readProducts();
            
            if (!products) {
                return []; 
            }
    
            const arrayGroup = [...products];
            if (limit) {
                arrayGroup.length = limit;
            }
            return arrayGroup;
        } catch (error) {
            console.error("Hubo un error al obtener los productos:", error);
            return []; 
        }
    }
    

    async getProductById(id) {
        try {
            const products = await this.readProducts();
            const productId = products.find(product => product.id === id);
            console.log(productId);
            return productId;
        } catch (error) {
            console.log("No se encontro el producto", error);
        }
    }

    async updateProduct(id, inputToUpdate) {
        try {
            const products = await this.readProducts();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                const originalProduct = products[productIndex];
                const updatedProduct = { ...originalProduct, ...inputToUpdate };
                products[productIndex] = updatedProduct;
                await fs.promises.writeFile(this.path, JSON.stringify(products));
                return updatedProduct;
            }
        } catch (error) {
            console.error("Hubo un error al actualizar el producto");
        }
    }

    async deleteProduct(id) {
        let message = 'El producto se elimino correctamente.';
        try {
            const products = await this.readProducts();
            const indexProduct = products.findIndex(product => product.id === id);
            if (indexProduct !== -1) {
                products.splice(indexProduct, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(products));
            } else {
                message = 'El producto no existe.';
            }
            return message;
        } catch (error) {
            message = "Hubo un error al eliminar el producto";
        }
    }
}