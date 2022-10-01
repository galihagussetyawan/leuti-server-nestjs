import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { RoyaltyEntity } from "./royalty.entity";

@Injectable()
export class RoyaltyService {

    constructor(
        @InjectRepository(RoyaltyEntity) private royaltyRepository: Repository<RoyaltyEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    async createRoyalty(userid: string) {

        try {

            const user = await this.userRepository.findOne({
                where: {
                    id: userid,
                }
            })

            const royalty = new RoyaltyEntity();
            royalty.user = user;
            royalty.amount = 10000;
            royalty.createdAt = Date.now().toString();
            royalty.updatedAt = Date.now().toString();

            return await this.royaltyRepository.save(royalty);

        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async getAllListRoyalty() {

        try {

            return await this.royaltyRepository.find({
                where: {
                    withdraw: false,
                },
                relations: {
                    user: true,
                },
                select: {
                    id: true,
                    createdAt: true,
                    amount: true,
                    user: {
                        id: true,
                        username: true,
                        email: true,
                    }
                },
                order: {
                    createdAt: 'DESC',
                }
            })

        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async getSearchRoyaltiesListByUser(search: string) {

        try {

            const royalties = await this.royaltyRepository.find({
                where: {
                    user: [
                        { id: search },
                        { username: search },
                    ],
                    withdraw: false,
                }
            })

            return {
                total: await royalties?.length === 0 ? 0 : royalties?.map(data => data?.amount).reduce((prev, next) => prev + next),
                items: await royalties,
            }

        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

    async getRoyaltiesByUser(userid: string) {

        try {

            const royaltiesList = await this.royaltyRepository.find({
                where: {
                    user: {
                        id: userid,
                    },
                    withdraw: false,
                }
            })

            return {
                items: royaltiesList,
                total: royaltiesList.length === 0 ? 0 : royaltiesList?.map(data => data?.amount)?.reduce((prev, next) => prev + next),
            }

        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }
}