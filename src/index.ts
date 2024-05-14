import express  from 'express';
import cors from 'cors';
import { Request,Response } from 'express';
import { createConnection } from 'typeorm';
import { Product } from './entity/product';

createConnection().then(connection =>{
const productRepository = connection.getRepository(Product);
const app = express();
app.use(cors());

app.use(express.json());

app.get('/api/products/frontend', async (req:Request, res:Response) => {
  const products = await productRepository.find();
  res.json(products);
}); 

app.get('/api/products/backend', async (req:Request, res:Response) => {
  const builder = productRepository.createQueryBuilder("products");

  //search query
  if(req.query.search){
    builder.where("products.title LIKE :search", {search: `%${req.query.search}%`});
  }
  
  //if the query string is sort=asc, then the products will be sorted in ascending order else in descending order
  if(req.query.sort){
    const sort = req.query.sort === 'asc' ? 'ASC' : 'DESC';
    builder.orderBy('products.price', sort);
  }
//to search and filter
//http://localhost:8000/api/products/backend?search=3&sort=asc

//pagination
  
const page = parseInt(req.query.page as string)||1;
const limit = 5;
//determine the lower bound
builder.offset((page - 1) * limit);
//determine upper bound
builder.limit(limit);
const last_page= Math.ceil(await builder.getCount()/limit);
const total = await builder.getCount();
  
  res.send({data:await builder.getMany(), page,last_page,total});
})

console.log('Listening on port 8000');

app.listen(8000);
})
