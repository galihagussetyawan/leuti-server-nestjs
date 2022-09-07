import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { DiscountEntity } from "src/discount/discount.entity";
import { OrderEntity } from "src/order/order.entity";
import { ProductEntity } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";
import { CartController } from "./cart.controller";
import { CartEntity } from "./cart.entity";
import { CartService } from "./cart.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([CartEntity, UserEntity, ProductEntity, OrderEntity, DiscountEntity])
    ],
    providers: [CartService, JwtAuthGuard],
    controllers: [CartController],
    exports: [TypeOrmModule]
})
export class CartModule { }