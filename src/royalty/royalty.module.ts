import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { RolesGuard } from "src/role/guard/roles.guard";
import { UserEntity } from "src/user/user.entity";
import { RoyaltyController } from "./royalty.controller";
import { RoyaltyEntity } from "./royalty.entity";
import { RoyaltyService } from "./royalty.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([RoyaltyEntity, UserEntity])
    ],
    providers: [RoyaltyService, JwtAuthGuard, RolesGuard],
    controllers: [RoyaltyController],
    exports: [TypeOrmModule],
})
export class RoyaltyModule { }