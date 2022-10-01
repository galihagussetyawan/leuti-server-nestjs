import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { RolesGuard } from "src/role/guard/roles.guard";
import { RoyaltyEntity } from "src/royalty/royalty.entity";
import { UserEntity } from "src/user/user.entity";
import { WithdrawController } from "./withdraw.controller";
import { WithdrawEntity } from "./withdraw.entity";
import { WithdrawService } from "./withdraw.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([WithdrawEntity, UserEntity, RoyaltyEntity])
    ],
    providers: [WithdrawService, JwtAuthGuard, RolesGuard],
    controllers: [WithdrawController],
    exports: [TypeOrmModule],
})
export class WithdrawModule { }