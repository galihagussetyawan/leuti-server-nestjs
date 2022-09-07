import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { UserEntity } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { RoleEntity } from "src/role/role.entity";
import { AuthService } from "src/auth/auth.service";
import { PointService } from "src/point/point.service";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
        private authService: AuthService,
        private pointService: PointService,
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

            await this.pointService.createPointByUser(userSaved);

            userSaved.role.forEach(role => userRoles.push(role.name));

            return {
                userId: userSaved.id,
                username: userSaved.username,
                roles: userRoles,
                accessToken: await this.authService.getToken(userSaved.id, userSaved.username, userRoles),
            };

        } catch (error) {

            if (error.code === 'ER_DUP_ENTRY') throw new BadRequestException('username sudah digunakan');
        }
    }

    async getAllUser() {

        try {

            const [list, count] = await this.userRepository.findAndCount({
                relations: {
                    role: true,
                    userDetail: true,
                }
            });

            const responseList = await list.map(data => {

                return {
                    id: data.id,
                    username: data.username,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    role: data.role,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    detail: data.userDetail,
                }

            })

            return {
                total: count,
                items: await responseList,
            }

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
                userDetail: true,
            }
        })


        if (!response) {
            throw new NotFoundException('user tidak ditemukan');
        }

        try {

            return {
                id: response?.id,
                firstname: response?.firstname,
                lastname: response?.lastname,
                username: response?.username,
                roles: response?.role.map(role => role.name),
                email: response?.email,
                createdAt: response?.createdAt,
                updatedAt: response?.updatedAt,
                detail: response?.userDetail,
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

    async searchUserByIdOrUsername(search: string) {

        try {

            const [list, count] = await this.userRepository.findAndCount({
                where: [
                    { id: search },
                    { username: Like(`%${search}%`) },
                ],
                relations: {
                    userDetail: true,
                }
            })

            const responseList = await list.map(data => {

                return {
                    id: data.id,
                    username: data.username,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    role: data.role,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    detail: data.userDetail,
                }
            })

            return {
                total: count,
                items: await responseList,
            }

        } catch (error) {

            throw new Error(error.message);

        }
    }
}