import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { unlink } from "fs";
import { join } from "path";
import { ImageEntity } from "src/image/image.entity";
import { Repository } from "typeorm";
import { ProductEntity } from "./product.entity";

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        @InjectRepository(ImageEntity) private imageRepository: Repository<ImageEntity>,
    ) { }

    async createProduct(productBody: ProductEntity): Promise<ProductEntity> {

        try {

            const product = new ProductEntity();
            product.name = productBody.name;
            product.price = productBody.price;
            product.stock = productBody.stock;
            product.category = productBody.category;
            product.description = productBody.description;
            product.advantage = productBody.advantage;
            product.application = productBody.application;
            product.ingredient = productBody.ingredient;
            product.createdAt = Date.now().toString();
            product.updatedAt = Date.now().toString();

            return await this.productRepository.save(product);

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async getAllProducts() {

        try {

            return await this.productRepository.find({
                relations: {
                    images: true,
                }
            });

        } catch (error) {

            throw new BadRequestException(error.message);
        }

    }

    async getProductById(id: string): Promise<ProductEntity> {

        try {

            const product = await this.productRepository.findOne({
                where: { id },
                relations: {
                    images: true,
                }
            });

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
            product.category = productBody.category;
            product.description = productBody.description;
            product.advantage = productBody.advantage;
            product.application = productBody.application;
            product.updatedAt = Date.now().toString();

            return await this.productRepository.update(id, product);

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async deleteProductById(id: string) {

        try {

            const product = await this.productRepository.findOne({
                where: {
                    id
                },
                relations: {
                    images: true,
                }
            });

            if (!product) {
                throw new NotFoundException('product tidak ditemukan');
            }

            if (product.images.length > 0) {

                product.images.forEach(async data => {

                    await unlink(join(process.cwd(), data.path), (error) => {

                        if (error) {
                            throw new BadRequestException(error.message);
                        }

                        this.imageRepository.delete({ id: data.id });
                    })
                })
            }

            return await this.productRepository.delete({ id })

        } catch (error) {

            throw new BadRequestException(error.message);
        }

    }
}