import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "src/product/product.entity";
import { ImageController } from "./image.controller";
import { ImageEntity } from "./image.entity";
import { ImageService } from "./image.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ImageEntity, ProductEntity])
    ],
    providers: [ImageService],
    controllers: [ImageController],
    exports: [TypeOrmModule],
})
export class ImageModule { }