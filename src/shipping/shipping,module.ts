import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShippingEntity } from "./shipping.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([ShippingEntity])
    ],
    providers: [],
    controllers: [],
    exports: [TypeOrmModule],
})
export class ShippingModule { }