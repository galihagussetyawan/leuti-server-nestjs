import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) { }

    async signin(usernameEmail: string, password: string) {

        const user = await this.userRepository.findOne({
            where: {
                username: usernameEmail
            },
            relations: {
                role: true,
            }
        })

        if (!user) throw new NotFoundException('username tidak ditemukan');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('password salah');

        if (user?.suspend) throw new UnauthorizedException('Akun anda terkena suspend. Hubungi admin untuk aktivasi kembali.');

        const userRoles = [];

        user.role.forEach(data => {
            userRoles.push(data.name);
        })

        return {
            userId: user.id,
            username: user.username,
            roles: userRoles,
            accessToken: await this.getToken(user.id, user.username, userRoles),
        };
    }

    async getToken(userId: string, username: string, roles: string[]) {

        const accessToken = await this.jwtService.signAsync(
            {
                sub: userId,
                username,
                roles
            },
            {
                secret: 'zKVn0AVs4mUYOZ1gJPydmYhAhhySqtl1penuV5JXOPU=',
                expiresIn: '365d',
            }
        )

        return accessToken;
    }

    async isAgent(userid: string) {

        try {

            const user = await this.userRepository.findOne({
                where: {
                    id: userid,
                },
                select: {
                    suspend: true,
                }
            })

            if (user.suspend) {
                throw new ForbiddenException('your account is suspensed');
            }

            return 'success';

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}