import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoyaltyEntity } from "src/royalty/royalty.entity";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { WithdrawEntity } from "./withdraw.entity";


@Injectable()
export class WithdrawService {

    constructor(
        @InjectRepository(WithdrawEntity) private withdrawRepository: Repository<WithdrawEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(RoyaltyEntity) private royaltyRepository: Repository<RoyaltyEntity>,
    ) { }

    async createWithdrawByUser(userid: string) {

        try {

            const royalties = await this.royaltyRepository.find({
                where: {
                    user: {
                        id: userid,
                    },
                    withdraw: false,
                }
            })

            const user = await this.userRepository.findOne({
                where: {
                    id: userid,
                }
            })

            if (royalties.length === 0) {
                throw new BadRequestException('not found royalties');
            }

            const withdrawAmount = royalties.map(data => data?.amount)?.reduce((prev, next) => prev + next);
            const royaltiesId = royalties.map(data => data?.id);

            const withdraw = new WithdrawEntity();
            withdraw.amount = withdrawAmount;
            withdraw.user = user;
            withdraw.createdAt = Date.now().toString();
            withdraw.updatedAt = Date.now().toString();

            await this.royaltyRepository.update(royaltiesId, { withdraw: true });
            return await this.withdrawRepository.save(withdraw);

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async completeWithdrawById(id: string) {

        try {

            return await this.withdrawRepository.update(id, { status: 'completed' });

        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async getWithdrawByUser(userid: string) {

        try {

            return await this.withdrawRepository.find({
                where: {
                    user: {
                        id: userid,
                    }
                }
            })

        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }
}