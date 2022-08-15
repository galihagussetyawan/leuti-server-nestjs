import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartEntity } from "src/cart/cart.entity";
import { UserEntity } from "src/user/user.entity";
import { OrderController } from "./order.controller";
import { OrderEntity } from "./order.entity";
import { OrderService } from "./order.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, CartEntity, UserEntity])
    ],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [TypeOrmModule],
})
export class OrderModule { }