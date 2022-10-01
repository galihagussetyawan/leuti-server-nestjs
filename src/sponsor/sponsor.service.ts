import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { In, Repository } from "typeorm";
import { SponsorEntity } from "./sponsor.entity";

@Injectable()
export class SponsorService {

    constructor(
        @InjectRepository(SponsorEntity) private sponsorRepossitory: Repository<SponsorEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    async createSponsorDownline(userid: string, userdownlineid: string) {

        try {

            const user = await this.userRepository.find({
                where: {
                    id: In([userid, userdownlineid])
                }
            })

            const sponsorUpline = new SponsorEntity();
            sponsorUpline.user = user[0];
            sponsorUpline.downline = [user[1]];
            sponsorUpline.createdAt = Date.now().toString();
            sponsorUpline.updatedAt = Date.now().toString();

            const sponsorDownline = new SponsorEntity();
            sponsorDownline.user = user[1];
            sponsorDownline.upline = user[0];
            sponsorDownline.createdAt = Date.now().toString();
            sponsorDownline.updatedAt = Date.now().toString();

            return await this.sponsorRepossitory.save([sponsorUpline, sponsorDownline]);

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async addSponsorDownlineById(id: string, userdownlineid: string) {

        try {

            const sponsor = await this.sponsorRepossitory.findOne({
                where: {
                    id
                },
                relations: {
                    user: true,
                    upline: true,
                    downline: true,
                }
            })

            const userDownline = await this.userRepository.findOne({
                where: {
                    id: userdownlineid,
                },
                relations: {
                    sponsor: {
                        upline: true,
                        downline: true,
                    }
                }
            })

            // if (sponsor?.downline?.length >= 2) {
            //     throw new BadRequestException('the maximum agent downline is 2 agents');
            // }

            if (userDownline?.sponsor?.upline) {
                throw new BadRequestException('sudah dikenalkan oleh agen lain');
            }

            if (sponsor?.downline?.length > 0) {
                sponsor.downline = [...sponsor?.downline, userDownline];
            } else {
                sponsor.downline = [userDownline];
            }

            const downlineSponsor = new SponsorEntity();

            if (userDownline.sponsor) {
                downlineSponsor.id = userDownline?.sponsor?.id;
                downlineSponsor.updatedAt = Date.now().toString();
            } else {
                downlineSponsor.createdAt = Date.now().toString();
                downlineSponsor.updatedAt = Date.now().toString();
                downlineSponsor.user = userDownline;
            }

            downlineSponsor.upline = sponsor.user;

            sponsor.updatedAt = Date.now().toString();

            return await this.sponsorRepossitory.save([sponsor, downlineSponsor]);

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async removeSponsorDownlineById(id: string, userdownlineid: string) {

        try {

            const sponsor = await this.sponsorRepossitory.findOne({
                where: {
                    id
                },
                relations: {
                    upline: true,
                    downline: true,
                }
            })

            const downlineUser = await this.userRepository.findOne({
                where: {
                    id: userdownlineid,
                },
                relations: {
                    sponsor: {
                        upline: true,
                    }
                }
            })

            const downline = sponsor?.downline?.filter(data => data.id !== userdownlineid);

            downlineUser.sponsor.upline = null;
            sponsor.downline = downline;

            return await this.sponsorRepossitory.save([sponsor, downlineUser?.sponsor]);

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getAllSponsorsByUser(userid: string) {

        try {

            const sponsors = await this.sponsorRepossitory.findOne({
                where: {
                    user: {
                        id: userid,
                    }
                },
                relations: {
                    downline: true,
                },
                select: {
                    downline: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                    }
                }
            })

            return sponsors;

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}