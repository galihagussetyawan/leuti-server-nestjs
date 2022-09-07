import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RewardController } from "./reward.controller";
import { RewardEntity } from "./reward.entity";
import { RewardService } from "./reward.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([RewardEntity])
    ],
    providers: [RewardService],
    controllers: [RewardController],
    exports: [TypeOrmModule]
})
export class RewardModule { }