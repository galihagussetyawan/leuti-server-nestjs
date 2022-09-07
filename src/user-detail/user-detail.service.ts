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

    async addUserDetailToUSer(userId: string, userDetailBody: UserDetailEntity) {

        try {

            userDetailBody.createdAt = Date.now().toString();
            userDetailBody.updatedAt = Date.now().toString();

            const savedUserDetail = await this.userDetailRepository.save(userDetailBody);
            const userDetailSaved = await this.userRepository.update(userId, { userDetail: savedUserDetail })

            return userDetailSaved;

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async updateUserDetail(id: string, userDetailBody: UserDetailEntity) {

        try {

            const userDetail = new UserDetailEntity();
            userDetail.country = userDetailBody?.country;
            userDetail.province = userDetailBody?.province;
            userDetail.city = userDetailBody?.city;
            userDetail.district = userDetailBody?.district;
            userDetail.village = userDetailBody?.village;
            userDetail.address = userDetailBody?.address;
            userDetail.postalCode = userDetailBody?.postalCode;
            userDetail.phone = userDetailBody?.phone;
            userDetail.updatedAt = Date.now().toString();

            const userDetailUpdated = await this.userDetailRepository.update(id, userDetail);

            return userDetailUpdated;

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }
}