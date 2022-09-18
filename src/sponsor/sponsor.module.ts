import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { SponsorController } from "./sponsor.controller";
import { SponsorEntity } from "./sponsor.entity";
import { SponsorService } from "./sponsor.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([SponsorEntity, UserEntity]),
        ScheduleModule.forRoot(),
    ],
    providers: [SponsorService],
    controllers: [SponsorController],
    exports: [TypeOrmModule],
})
export class SponsorModule { }