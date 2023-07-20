import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";

const productService = new ProductManager('products.json');
const router = Router();

//middlewares

const validateFields = (req,res,next) =>{
    const productInfo = req.body;
    if((!productInfo.title) || (!productInfo.description) || (!productInfo.code) || 
    (!productInfo.price) || (!productInfo.stock) ||
    (!productInfo.category)){
        
        console.error("Todos los campos deben estar llenos");
        res.json({status:"error",message:"todos los campos deben estar llenos"});
    } else {
        //continua al siguiente callback
        next();
    }
};

//routers

router.get("/",validateFields, async(req,res)=>{
    try{
        const limit = parseInt(req.query.limit);
        const products = await productService.getProducts();

        if(limit){
            const limitedProducts = products.slice(0,limit);
            res.send({status:"success", data:limitedProducts});
        }
        else{
            res.send({status:"success",data:products});
        }

    }catch (error){
        res.status(500).send("Hubo un error al obtener los productos");
    }
});

router.get("/:pid",validateFields,async(req,res)=>{
    try{
        const productId = parseInt(req.params.pid);
        const findProduct = await productService.getProductsById(productId);
        if(findProduct){
            res.send({status:"success",data:findProduct});
        }
        else{
            res.status(404).json({status:"Error",message:"El producto no existe!!!"});
        }

    }catch (error){
        res.status(500).send("Hubo un error al obtener el producto");
    }
});

router.post("/",validateFields,async(req,res)=>{
    try{
        const newInfo = req.body;
        const productCreated = await productService.addProduct(newInfo);

        if(productCreated){
            res.json({status:"Success",data:productCreated, message:"Prducto creado correctamente"});
        }
        else{
            res.status(500).send("Hubo un error al guardar el producto");
        }

    }catch (error){
        console.error(error);
        res.status(500).send("Hubo un error al crear el producto");
    }

});

router.put("/:pid",validateFields,async(req,res)=>{
    try{
        const newInfo = req.body;
        const idProduct = parseInt(req.params.pid);
        const updatedProduct = await productService.updateProduct(idProduct,newInfo);
        console.log("El archivo actualizado es: ",updatedProduct);
        if(updatedProduct){
            res.json({status:"Success", data:updatedProduct,message:"Producto Actualizado"});
        }
        else{
            res.status(404).json({status:"Error",message:"El producto no existe!!!"});
        }
    }catch(error){
        res.status(500).send('Hubo un error al obtener el producto');
    }
});

router.delete("/:pid",validateFields,async(req,res)=>{
    try {
        const idProduct = parseInt(req.params.pid);
        const deletedProduct = await productService.deleteProduct(idProduct);

        if (deletedProduct) {
            res.json({status: "Success", data: deletedProduct, message: "Producto eliminado correctamente"});
        } else {
            res.status(404).json({status: "Error", message: "El producto no existe!!!"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Hubo un error al eliminar el producto");
    }
});

export {router as productsRouter};