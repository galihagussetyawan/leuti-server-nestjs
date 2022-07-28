import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { };

    async createUser(user: UserEntity): Promise<any> {

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);

        user.password = hash;
        user.createdAt = Date.now().toString();
        user.updatedAt = Date.now().toString();

        try {

            if (user.password === null || user.password === '') throw new BadRequestException('password tidak boleh kosong');

            return await this.userRepository.save(user);
        } catch (error) {

            console.log(error.message);

            if (error.code === 'ER_DUP_ENTRY') throw new BadRequestException('username sudah digunakan');
        }
    }
}