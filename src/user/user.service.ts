import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { RoleEntity } from "src/role/role.entity";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
        private authService: AuthService,
    ) { };

    async registerUser(user: UserEntity) {

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

        const userRoles = [];

        try {

            const userSaved: UserEntity = await this.userRepository.save(user);

            userSaved.role.forEach(role => userRoles.push(role.name));

            return {
                userId: userSaved.id,
                username: userSaved.username,
                roles: userRoles,
                accessToken: await this.authService.getToken(userSaved.id, userSaved.username, userRoles),
            };

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

    async getUserById(id: string) {

        if (!id) {
            throw new BadRequestException('user id kosong');
        }

        const response = await this.userRepository.findOne({
            where: {
                id,
            },
            relations: {
                role: true,
            }
        })

        if (!response) {
            throw new NotFoundException('user tidak ditemukan');
        }

        try {

            return {
                id: response.id,
                firstname: response.firstname,
                lastname: response.lastname,
                username: response.username,
                roles: response.role.map(role => role.name),
                createdAt: response.createdAt,
                updatedAt: response.updatedAt,
            }

        } catch (error) {

            throw new Error(error.message);
        }
    }

    async deleteUserById(id: string) {

        try {

            return await this.userRepository.delete({ id });

        } catch (error) {

            throw new Error(error.message);
        }
    }
}