import { Router, query } from "express";
import { CartManager } from "../dao/CartManager.js";
import { ProductManager } from '../dao/ProductManager.js';

const productService = new ProductManager('products.json');
const cartService = new CartManager('carts.json');
const router = Router();

//middlewares

const validateFields = (req,res,next) =>{}

//routers

router.get("/", async(req,res)=>{
    try{
        const limit = parseInt(req,query.limit);
        const carts = await cartService.getCarts();
    
        if(limit){
            const limitedCarts = carts.slice(0,limit);
            res.send({status:"Success", data:limitedCarts});
        }
        else{
            res.send({status:"Success",data:carts});
        }
    }catch(error){
        res.status(500).send("Hubo un error al obtener los carritos");
    }
});

router.get("/:pid",(req,res)=>{

});

router.post("/",async(req,res)=>{
    try{
        const newInfo = req.body;
        const cartCreated = await cartService.addCart(newInfo);
        if(cartCreated){
            res.json({status:"Success",data:cartCreated, message:"Carrito creado correctamente"});
        }
        else{
            res.status(500).send("Hubo un error al guardar el carrito");
        }
    }catch(error){
        res.status(500).send("Hubo un error al crear el carrito");
    }
});

router.post("/:cid/products/:pib",async(req,res)=>{
    try{
        const idCart = parseInt(req.params.cid);
        const idProduct = parseInt(req.params.pib);
        const carts = await cartService.getCarts();

        console.log("el valor de idCart es: ",idCart);
        console.log("el valor de idProduct es: ",idProduct);

        const findCart = await cartService.getCartsById(idCart);
        console.log("el valor de findCart es: ",findCart);

        const findProduct = await productService.getProductsById(idProduct);
        console.log("el valor de findProduct es: ",findProduct);

        const findIndexProduct = findCart.products.findIndex((product)=>{return product.id === idProduct});
        console.log("el valor de findIndexProduct es: ",findIndexProduct);
        

        if (!findCart) {
            res.status(404).send("Carrito no encontrado");
            return;
        }
        if (!findProduct) {
            res.status(404).send("Producto no encontrado");
            return;
        }
        if(findIndexProduct >= 0){
            findCart.products[findIndexProduct].quantity += 1;
            console.log("el valor de findCart.products[findIndexProduct].quantity+1 es: ",findCart.products[findIndexProduct].quantity);
    
        }
        else{
            const newProduct = {
                product: idProduct,
                quantity: 1
        };
        
        console.log("el valor de newProduct es: ",newProduct);
        findCart.products.push(newProduct);
        //Buscamos el index del findCart 
        const findIndexCart = carts.findIndex((cart) =>{return cart.products.id === idCart});
        
        if(findIndexCart >= 0){
            carts[findIndexCart] = {...carts[findIndexCart],...findCart};
            await cartService.saveCarts(carts);
            console.log("Carts guardado");
        }
    }
        res.json({status:"Success", message:"Producto añadido correctamente", cart: findCart});
    }catch(error){
        console.log(error);
        res.status(500).send("Hubo un error en el proceso");
    }
})

router.put("/:pid",(req,res)=>{

});

router.delete("/:pid",(req,res)=>{

})

export {router as cartsRouter};