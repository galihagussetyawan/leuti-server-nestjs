import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { PointController } from "./point.controller";
import { PointEntity } from "./point.entity";
import { PointService } from "./point.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PointEntity, UserEntity])
    ],
    providers: [PointService],
    controllers: [PointController],
    exports: [TypeOrmModule],
})
export class PointModule {

}