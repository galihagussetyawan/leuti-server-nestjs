import { Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { RoleService } from "./role.service";

@Controller('api')
export class RoleController {
    constructor(private roleService: RoleService) { }

    @Post('role')
    async createRole(@Req() req: Request) {

        const { name } = req.query;

        try {

            return await this.roleService.createRole(name.toString());

        } catch (error) {

            throw new Error(error.message);
        }
    }

    @Post('role/add')
    async addRoleToUser(@Req() req: Request) {

        const { userid, rolename } = req.query;

        try {

            return await this.roleService.addRoleToUser(userid.toString(), rolename.toString());

        } catch (error) {

            throw new Error(error.message);
        }
    }
}