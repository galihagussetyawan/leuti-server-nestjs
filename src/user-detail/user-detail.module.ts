import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UserEntity } from "src/user/user.entity";
import { UserDetailController } from "./user-detail.controller";
import { UserDetailEntity } from "./user-detail.entity";
import { UserDetailService } from "./user-detail.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserDetailEntity, UserEntity])
    ],
    providers: [UserDetailService, JwtAuthGuard],
    controllers: [UserDetailController],
    exports: [TypeOrmModule],
})
export class UserDetailModule { }