import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { RolesGuard } from "src/role/guard/roles.guard";
import { RoleEntity } from "src/role/role.entity";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, RoleEntity])
    ],
    controllers: [UserController],
    providers: [UserService, JwtAuthGuard, RolesGuard],
    exports: [TypeOrmModule]
})
export class UserModule { }