import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PointEntity } from "src/point/point.entity";
import { PointService } from "src/point/point.service";
import { RolesGuard } from "src/role/guard/roles.guard";
import { RoleEntity } from "src/role/role.entity";
import { RoyaltyEntity } from "src/royalty/royalty.entity";
import { SponsorEntity } from "src/sponsor/sponsor.entity";
import { UserDetailEntity } from "src/user-detail/user-detail.entity";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, RoleEntity, PointEntity, UserDetailEntity, SponsorEntity, RoyaltyEntity]),
        AuthModule,
    ],
    controllers: [UserController],
    providers: [UserService, JwtAuthGuard, RolesGuard, PointService],
    exports: [TypeOrmModule]
})
export class UserModule { }