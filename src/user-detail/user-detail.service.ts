import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { UserDetailEntity } from "./user-detail.entity";

@Injectable()
export class UserDetailService {

    constructor(
        @InjectRepository(UserDetailEntity) private userDetailRepository: Repository<UserDetailEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    async getUserDetailByUser(userId: string) {

        try {

            const user = await this.userRepository.findOneBy({ id: userId });

            if (!user) {
                throw new NotFoundException('user tidak ditemukan');
            }

            return await this.userDetailRepository.find({
                where: { user },
            })


        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async addUserDetailToUSer(userId: string, userDetailBody: UserDetailEntity) {

        try {

            const user = await this.userRepository.findOneBy({ id: userId });

            const userDetail = new UserDetailEntity();
            userDetail.user = user;
            userDetail.country = userDetailBody.country;
            userDetail.province = userDetailBody.province;
            userDetail.city = userDetailBody.city;
            userDetail.districts = userDetailBody.districts;
            userDetail.village = userDetailBody.village;
            userDetail.address = userDetailBody.address;
            userDetail.postalCode = userDetailBody.postalCode;
            userDetail.phone = userDetailBody.phone;
            userDetail.createdAt = Date.now().toString();
            userDetail.updatedAt = Date.now().toString();

            const userDetailSaved = await this.userDetailRepository.save(userDetail);

            return userDetailSaved;

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async updateUserDetail(id: string, userDetailBody: UserDetailEntity) {

        try {

            const userDetail = new UserDetailEntity();
            userDetail.country = userDetailBody.country;
            userDetail.province = userDetailBody.province;
            userDetail.city = userDetailBody.city;
            userDetail.districts = userDetailBody.districts;
            userDetail.village = userDetailBody.village;
            userDetail.address = userDetailBody.address;
            userDetail.postalCode = userDetailBody.postalCode;
            userDetail.phone = userDetailBody.phone;
            userDetail.updatedAt = Date.now().toString();

            const userDetailUpdated = await this.userDetailRepository.update(id, userDetail);

            return userDetailUpdated;

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }
}