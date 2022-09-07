import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RewardEntity } from "./reward.entity";

@Injectable()
export class RewardService {

    constructor(
        @InjectRepository(RewardEntity) private rewardRepository: Repository<RewardEntity>
    ) { }

    async createReward(requestRewardBody: RewardEntity) {

        try {

            requestRewardBody.createdAt = Date.now().toString();
            requestRewardBody.updatedAt = Date.now().toString();

            return await this.rewardRepository.save(requestRewardBody);

        } catch (error) {

            throw new BadRequestException(error?.message);
        }
    }

    async updateRewardById(id: string, requestRewardBody: RewardEntity) {

        try {

            return await this.rewardRepository.update(id, {
                point: requestRewardBody?.point,
                day: requestRewardBody?.day,
                description: requestRewardBody?.description,
                updatedAt: Date.now().toString(),
            })

        } catch (error) {

            throw new BadRequestException(error?.message);

        }
    }

    async deleteRewardById(id: string) {

        try {

            return await this.rewardRepository.delete(id);

        } catch (error) {

            throw new BadRequestException(error?.message);

        }
    }

    async getAllRewards() {

        try {

            return await this.rewardRepository.find();

        } catch (error) {

            throw new BadRequestException(error?.message);

        }
    }
}