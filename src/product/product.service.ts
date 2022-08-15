import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getConnection, Repository } from "typeorm";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    ) { }

    async createProduct(productBody: ProductEntity): Promise<ProductEntity> {

        try {

            const product = new ProductEntity();
            product.name = productBody.name;
            product.price = productBody.price;
            product.stock = productBody.stock;
            product.createdAt = Date.now().toString();
            product.updatedAt = Date.now().toString();

            return await this.productRepository.save(product);

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async getAllProducts() {

        try {

            return await this.productRepository.find();

        } catch (error) {

            throw new BadRequestException(error.message);
        }

    }

    async getProductById(id: string): Promise<ProductEntity> {

        try {

            const product = await this.productRepository.findOneBy({ id });

            if (!product) {
                throw new NotFoundException('product tidak ditemukan');
            }

            return product;

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async updateProductById(id: string, productBody: ProductEntity) {

        try {

            const product = new ProductEntity();
            product.name = productBody.name;
            product.price = productBody.price;
            product.stock = productBody.stock;
            product.updatedAt = Date.now().toString();

            return await this.productRepository.update(id, product);

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async deleteProductById(id: string) {

        try {

            const product = await this.productRepository.findOneBy({ id });

            if (!product) {
                throw new NotFoundException('product tidak ditemukan');
            }

            return await this.productRepository.delete({ id })

        } catch (error) {

            throw new BadRequestException(error.message);
        }

    }
}