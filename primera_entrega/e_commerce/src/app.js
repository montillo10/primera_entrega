import express from "express";
import { productsRouter } from './routes/products.routes.js';

const port = 8080;
const app = express();

//middlewares

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.listen(port, ()=>console.log(`Server listening on port ${port}`));

//routes

app.use("/api/products",productsRouter);
