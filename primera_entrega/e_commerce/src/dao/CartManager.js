import { __dirname } from "../utils.js";
import path from "path";
import fs from "fs";


class CartManager{
    constructor(FileName){
        this.path = path.join(__dirname, `/files/${FileName}`);
    };

    fileExist(){
        return fs.existsSync(this.path);
    };

    asignID(products){

        let idAux =1;
        if(products.length  > 0){
            idAux = products[products.length-1].id +1;
            console.log("el id es: ",idAux);
            return idAux;
        }
        else{
            console.log("el id es: ",idAux);
            return idAux;
        }
    };

    async saveCarts(carts){
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
        } catch (error) {
            console.error("Hubo un error al guardar los carritos: ", error);
        }
    }

    async getCarts(){
        try{
            if(this.fileExist()){
                const cartsData = await fs.promises.readFile(this.path);
                const carts = JSON.parse(cartsData);
                return carts;
            }
            else{
                throw new Error("No es posible obtener los carritos ");
            }
        }catch(error){
            throw error;
        }
    };

    async getCartsById(cartId){
        console.log("-----Estoy en getCartsById(cartId)---");
        console.log("el valor de cartId es: ",cartId);

        try{
            if(this.fileExist()){

                const carts = await this.getCarts();
                console.log("el valor de carts es: ",carts);

                const findedCart = carts.find((cart)=>{return cart.id === cartId});
                console.log("el valor de findedCart es: ",findedCart);
                return findedCart;
            }
            else{
                throw new Error("No es posible obtener el archivo (No existe o no se encuentra)");
            }
        }catch(error){
            throw error;
        }
    };

    async getProductsInCartById(){
        products
    }

    async addCart(cart){
        try{
            if(this.fileExist){
                const carts = await this.getCarts();
                let newId = this.asignID(carts);

                const newCart = {
                    id: newId,
                    products: []
                };

                carts.push(newCart);
                await this.saveCarts(carts);
                return newCart;
            }
            else{
                throw new Error("No es posible obtener el archivo (No existe o no se encuentra)");
            }

        }catch(error){
            throw error;
        }
    };

/*    async addProductInCart(idCart,idProduct){
        try{
            if(this.fileExist()){
                const carts = this.getCarts();
                const findIndexCart = carts.findIndex((cart)=>{return carts.id === idCart});
                carts[findIndexCart] = {}
            }

        }catch(error){
            throw error;
        }
    }
*/
}

export { CartManager };

