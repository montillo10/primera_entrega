import { __dirname } from "../utils.js";
import path from "path";
import fs from "fs";
//import {v4 as uuidv4} from 'uuid';

class ProductManager{
    constructor(FileName){
        this.path = path.join(__dirname, `/files/${FileName}`);
    };

    //Funciones

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
    }
    

    async saveProducts(products){
        console.log("el arreglo de productos que llega antes de guardar es: ",products);
        await fs.promises.writeFile(this.path, JSON.stringify(products,null,"\t"));
    }

    async getProducts(){
        try{
            if(this.fileExist()){
                const productsData = await fs.promises.readFile(this.path);
                const products = JSON.parse(productsData);
                return products;
            } 
            else{
                throw new Error("No es posible obtener los productos");
            }
        }catch( error){
            throw error;
        }
    }

    async getProductsById(productId){
        try{
            if(this.fileExist()){
                const products = await this.getProducts();
                const findedProduct = products.find((product)=>{return product.id === productId});
                return findedProduct;
            }
            else{
                throw new Error("No es posible obtener el producto ( El archivo no existe) ");
            }
        }catch(error){
            throw error;
        }
    }

    async addProduct(product){
        try{
            if(this.fileExist()){
                const products =await this.getProducts();
                //let new id = uuidv4{};
                //asignar el ID
                let newId = this.asignID(products);

                const newProduct = {
                    id: newId,
                    ...product
                };
                
                products.push(newProduct);
                await this.saveProducts(products);
                return newProduct;
            }
            else{
                throw new Error("No es posible guardar el producto");
            }

        }catch(error){
            throw error;
        } 
    }

    async updateProduct(idProduct,updatedProduct){
        try{
            if(this.fileExist()){
                const products = await this.getProducts();
                const findIndexProduct = products.findIndex((product)=>{return product.id === idProduct});
                delete updatedProduct.id;

                console.log("estoy en UpdateProduct, el valor recibido de updatedProduct es: ",updatedProduct);

                products[findIndexProduct] = {...products[findIndexProduct], ...updatedProduct};
                console.log("el objeto ya agregado al array en la posicion encontrada es: ",products[findIndexProduct]);
                await this.saveProducts(products);
                return products[findIndexProduct];
            }
            else{
                throw new Error("No es posible actualizar el producto ( El archivo no existe) ");
            }
        }catch (error){
            throw error;
        }
    }

    async deleteProduct(idProduct) {
        try {
            if (this.fileExist()) {
                const products = await this.getProducts();
                const findIndexProduct = products.findIndex((product) => { return product.id === idProduct });
    
                if (findIndexProduct === -1) {
                    throw new Error("Producto no encontrado");
                }
    
                const deletedProduct = products[findIndexProduct];
                products.splice(findIndexProduct, 1);
                await this.saveProducts(products);
                return deletedProduct;
            } 
            else {
                throw new Error("No es posible eliminar el producto (el archivo no existe)");
            }
        } catch (error) {
            throw error;
        }
    }
}

export {ProductManager};

