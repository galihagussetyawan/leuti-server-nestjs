import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { PointEntity } from "src/point/point.entity";
import { UserEntity } from "src/user/user.entity";
import { In, LessThan, Not, Repository } from "typeorm";

@Injectable()
export class CronJobService {

    constructor(
        @InjectRepository(PointEntity) private pointRepository: Repository<PointEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async test() {

        try {

            const userAdmin = await this.userRepository.find({
                where: {
                    role: {
                        name: 'admin',
                    }
                },
                relations: {
                    role: true,
                },
                select: {
                    id: true,
                }
            })

            const points = await this.pointRepository.find({
                where: {
                    point: LessThan(30),
                    user: {
                        id: Not(In(userAdmin?.map(data => data?.id))),
                        suspend: false,
                    }
                },
                relations: {
                    user: true,
                },
                select: {
                    id: true,
                    point: true,
                    createdAt: true,
                    user: {
                        id: true,
                    }
                }
            });

            const suspendAgent = points?.filter(data => {

                if ((Math.ceil(((((Date.now() - Number(data?.createdAt)) / 1000) / 60) / 60) / 24) - 1) > 90 && data.point < 30) {
                    return data;
                }
            })

            if (suspendAgent.length !== 0) {
                await this.userRepository.update(suspendAgent?.flatMap(data => data?.user?.id), { suspend: true });
            }

        } catch (error) {

        }
    }
}