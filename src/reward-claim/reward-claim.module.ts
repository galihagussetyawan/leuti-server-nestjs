import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PointEntity } from "src/point/point.entity";
import { RewardEntity } from "src/reward/reward.entity";
import { UserEntity } from "src/user/user.entity";
import { RewardClaimController } from "./reward-claim.controller";
import { RewardClaimEntity } from "./reward-claim.entity";
import { RewardClaimService } from "./reward-claim.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([RewardClaimEntity, RewardEntity, UserEntity, PointEntity])
    ],
    providers: [RewardClaimService, JwtAuthGuard],
    controllers: [RewardClaimController],
    exports: [TypeOrmModule],
})
export class RewardClaimModule {

}