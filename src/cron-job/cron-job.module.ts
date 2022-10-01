import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PointEntity } from "src/point/point.entity";
import { UserEntity } from "src/user/user.entity";
import { CronJobService } from "./cron-job.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PointEntity, UserEntity]),
        ScheduleModule.forRoot(),
    ],
    providers: [CronJobService],
    controllers: [],
    exports: [TypeOrmModule]
})
export class CronJobModule { }