import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { RoleEntity } from "src/role/role.entity";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
    ) { };

    async registerUser(user: UserEntity): Promise<any> {

        const roleAgent = await this.roleRepository.findOneBy({ name: 'agent' });

        if (user.password === null || user.password === '') {
            throw new BadRequestException('password tidak boleh kosong');
        }

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);

        user.password = hash;
        user.createdAt = Date.now().toString();
        user.updatedAt = Date.now().toString();
        user.role = [roleAgent];

        try {

            return await this.userRepository.save(user);

        } catch (error) {

            console.log(error.message);

            if (error.code === 'ER_DUP_ENTRY') throw new BadRequestException('username sudah digunakan');
        }
    }

    async getAllUser() {

        const userList = [];

        try {

            const list = await this.userRepository.find({
                relations: {
                    role: true,
                }
            });

            list.forEach(data => {

                const response = {
                    id: data.id,
                    username: data.username,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    role: data.role,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                };

                userList.push(response);
            })

            return userList;

        } catch (error) {

            throw new Error(error.message);
        }
    }
}