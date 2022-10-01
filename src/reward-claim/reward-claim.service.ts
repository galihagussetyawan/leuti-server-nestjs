import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PointEntity } from "src/point/point.entity";
import { RewardEntity } from "src/reward/reward.entity";
import { Repository } from "typeorm";
import { RewardClaimEntity } from "./reward-claim.entity";

@Injectable()
export class RewardClaimService {

    constructor(
        @InjectRepository(RewardClaimEntity) private rewardClaimRepository: Repository<RewardClaimEntity>,
        @InjectRepository(RewardEntity) private rewardRepository: Repository<RewardEntity>,
        @InjectRepository(PointEntity) private pointRepository: Repository<PointEntity>,
    ) { }

    async createRewardClaim(userid: string, rewardid: string) {

        try {

            const point = await this.pointRepository.findOne({
                where: {
                    user: {
                        id: userid,
                    }
                },
                relations: {
                    user: true,
                }
            })

            const reward = await this.rewardRepository.findOne({
                where: {
                    id: rewardid,
                }
            })

            // const currentTime = Math.ceil(((((Date.now() - Number(point?.createdAt)) / 1000) / 60) / 60) / 24);

            if (point?.point < reward?.point) {

                throw new BadRequestException("You can't claim this reward yet");
            }

            const rewardClaim = new RewardClaimEntity();
            rewardClaim.reward = reward;
            rewardClaim.user = point?.user;
            rewardClaim.createdAt = Date.now().toString();
            rewardClaim.updatedAt = Date.now().toString();

            if (point?.point >= reward?.point) {
                await this.rewardClaimRepository.save(rewardClaim);
                point.point = point?.point - reward?.point;
            }

            point.createdAt = Date.now().toString();
            point.updatedAt = Date.now().toString();

            await this.pointRepository.save(point);
            return 'succes claim reward';

        } catch (error) {
            throw new BadRequestException(error?.message)
        }
    }

    async getAllRewardClaims() {

        try {

            const rewardClaimList = await this.rewardClaimRepository.find({
                order: {
                    createdAt: 'DESC',
                },
                relations: {
                    user: true,
                    reward: true,
                },
                select: {
                    id: true,
                    createdAt: true,
                    user: {
                        firstname: true,
                        lastname: true,
                    },
                    reward: {
                        description: true,
                    }
                }
            })

            return await rewardClaimList?.map(data => {

                return {
                    firstname: data?.user?.firstname,
                    lastname: data?.user?.lastname,
                    reward: data?.reward?.description,
                    createdAt: data?.createdAt,
                }
            })

        } catch (error) {
            throw new BadRequestException(error?.message)
        }
    }

    async getRewardClaimsByUser() {

        try {

            return await this.rewardClaimRepository.find();

        } catch (error) {
            throw new BadRequestException(error?.message)
        }
    }

    async approveRequestClaimRewardById(id: string) {

        try {

            return await this.rewardClaimRepository.update(id, { status: 'approved', 'updatedAt': Date.now().toString() })

        } catch (error) {
            throw new BadRequestException(error?.message)
        }
    }
}