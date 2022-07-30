import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { RoleController } from "./role.controller";
import { RoleEntity } from "./role.entity";
import { RoleService } from "./role.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([RoleEntity, UserEntity])
    ],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [TypeOrmModule]
})
export class RoleModule { };