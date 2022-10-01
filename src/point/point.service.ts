import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { In, Not, Repository } from "typeorm";
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

    async getPointByUser(userid: string) {

        try {

            const point = await this.pointRepository.findOne({
                relations: {
                    user: true,
                },
                where: {
                    user: {
                        id: userid,
                    }
                }
            })

            return point;

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getAllPoints() {

        try {

            const userAdmin = await this.userRepository.find({
                where: {
                    role: {
                        name: 'admin',
                    }
                },
                relations: {
                    role: true,
                }
            })

            const pointList = await this.pointRepository.find({
                order: {
                    point: 'DESC',
                },
                where: {
                    user: {
                        id: Not(In(userAdmin?.map(data => data?.id))),
                    }
                },
                relations: {
                    user: {
                        role: true,
                        userDetail: true,
                    }
                },
            })

            return await pointList?.map(data => {

                return {
                    point: data?.point,
                    firstname: data?.user?.firstname,
                    lastname: data?.user?.lastname,
                    username: data?.user?.username,
                    join: data?.user?.createdAt,
                    country: data?.user?.userDetail?.country ?? '-',
                    city: data.user?.userDetail?.city ?? '-',
                    day: Math.ceil(((((Date.now() - Number(data?.createdAt)) / 1000) / 60) / 60) / 24) - 1,
                    // day: new Date().getDate() - new Date(Number(data?.createdAt)).getDate(),
                }
            })

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    async updatePointById(id: string, point: number) {

        try {

            const points = new PointEntity();
            points.point = point;
            points.updatedAt = Date.now().toString();

            return await this.pointRepository.update(id, points);

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }
}