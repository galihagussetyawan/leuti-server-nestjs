import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiscountEntity } from "src/discount/discount.entity";
import { ImageEntity } from "src/image/image.entity";
import { ProductController } from "./product.controller";
import { ProductEntity } from "./product.entity";
import { ProductService } from "./product.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductEntity, ImageEntity, DiscountEntity]),
    ],
    providers: [ProductService],
    controllers: [ProductController],
    exports: [TypeOrmModule]
})
export class ProductModule { }