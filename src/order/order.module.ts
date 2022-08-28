import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { CartEntity } from "src/cart/cart.entity";
import { RolesGuard } from "src/role/guard/roles.guard";
import { ShippingEntity } from "src/shipping/shipping.entity";
import { UserEntity } from "src/user/user.entity";
import { OrderController } from "./order.controller";
import { OrderEntity } from "./order.entity";
import { OrderService } from "./order.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, CartEntity, UserEntity, ShippingEntity])
    ],
    providers: [OrderService, JwtAuthGuard, RolesGuard],
    controllers: [OrderController],
    exports: [TypeOrmModule],
})
export class OrderModule { }