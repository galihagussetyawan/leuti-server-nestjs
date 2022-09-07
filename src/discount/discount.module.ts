import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "src/product/product.entity";
import { DiscountController } from "./discount.controller";
import { DiscountEntity } from "./discount.entity";
import { DiscountService } from "./discount.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([DiscountEntity, ProductEntity])
    ],
    providers: [DiscountService],
    controllers: [DiscountController],
    exports: [TypeOrmModule]
})
export class DiscountModule { }