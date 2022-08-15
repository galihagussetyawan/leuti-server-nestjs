import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { PointEntity } from "./point.entity";

@Injectable()
export class PointService {

    constructor(
        @InjectRepository(PointEntity) private pointRepository: Repository<PointEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    async createPointByUser(user: UserEntity) {

        try {

            const point = new PointEntity();
            point.user = user;
            point.point = 0;
            point.createdAt = Date.now().toString();
            point.updatedAt = Date.now().toString();

            return await this.pointRepository.save(point);

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async addPointByUser(userid: string) {

        try {

            const user = await this.userRepository.findOneBy({ id: userid });

            const point = new PointEntity();
            point.user = user;
            point.point = 0;
            point.createdAt = Date.now().toString();
            point.updatedAt = Date.now().toString();

            return await this.pointRepository.save(point);

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async getAllPoints() {

        try {

            const pointList = await this.pointRepository.find({
                relations: {
                    user: true,
                },
            })

            return pointList.map(data => {

                return {
                    point: data.point,
                    username: data.user.username,
                    join: data.user.createdAt,
                }
            })

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }
}