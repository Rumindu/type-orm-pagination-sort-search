// populating dummy data to the database
import {createConnection} from "typeorm";
import {Product} from "../src/entity/product";


createConnection().then(async (connection) => {
    const productRepository = connection.getRepository(Product);

    for (let i = 0; i < 50; i++) {
        await productRepository.save({
            title: `Product ${Math.floor(Math.random() * 1000)}`,
            description: `description ${Math.floor(Math.random() * 1000)}`,
            image: `image ${Math.floor(Math.random() * 1000)}`,
            price: Math.floor(Math.random() * 1000)
        });
    }

    process.exit();
});
