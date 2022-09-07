import { BadGatewayException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/product/product.entity";
import { Repository } from "typeorm";
import { DiscountEntity } from "./discount.entity";

@Injectable()
export class DiscountService {

    constructor(
        @InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>,
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    ) { }

    async addDiscountToProduct(productid: string, discountRequestBody: DiscountEntity) {

        try {

            const product = await this.productRepository.findOne({
                where: { id: productid },
                relations: {
                    discounts: true,
                }
            })

            discountRequestBody.createdAt = Date.now().toString();
            discountRequestBody.updatedAt = Date.now().toString();
            discountRequestBody.product = product;

            const discount = await this.discountRepository.save(discountRequestBody);

            return discount;

        } catch (error) {
            throw new BadGatewayException(error?.message);
        }
    }

    async updateDiscountById(id: string, requestDiscountBody: DiscountEntity) {

        try {

            return await this.discountRepository.update(id, { quantity: requestDiscountBody?.quantity, item: requestDiscountBody?.item, addOns: requestDiscountBody?.addOns })

        } catch (error) {
            throw new BadGatewayException(error?.message);
        }
    }

    async deleteDiscountById(id: string) {

        try {

            return await this.discountRepository.delete(id);

        } catch (error) {
            throw new BadGatewayException(error?.message);
        }
    }
}