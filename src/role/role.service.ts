import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { RoleEntity } from "./role.entity";

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    async createRole(name: string) {

        const role = new RoleEntity();

        role.name = name;

        try {

            return await this.roleRepository.save(role);

        } catch (error) {

            throw new Error(error.message);
        }
    }

    async addRoleToUser(userId: string, roleName: string) {

        const user = await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations: {
                role: true
            }
        })
        const role = await this.roleRepository.findOneBy({ name: roleName });

        user.role = [...user.role, role];
        user.updatedAt = Date.now().toString();

        // return await this.userRepository.update(user.id, user);
        return await this.userRepository.save(user);
    }
}