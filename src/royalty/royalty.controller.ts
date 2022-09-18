import { Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PrincipalDecorator } from "src/commons/decorators/principal.decorator";
import { Roles } from "src/role/decorator/roles.decorator";
import { RolesGuard } from "src/role/guard/roles.guard";
import { Role } from "src/role/role.enum";
import { RoyaltyService } from "./royalty.service";

@Controller('api')
export class RoyaltyController {

    constructor(
        private royaltyService: RoyaltyService,
    ) { }

    @Post('royalty')
    async createRoyalty(@Req() req: Request, @Res() res: Response) {

        try {

            const { userid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.royaltyService.createRoyalty(userid.toString()),
            })

        } catch (error) {
            res.status(error?.status).send({
                status: error?.status,
                error_message: error?.message,
            })
        }
    }

    @Get('royalties/all')
    async getAllListRoyaty(@Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.royaltyService.getAllListRoyalty(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('royalties')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.AGENT)
    async getRoyaltiesByUser(@PrincipalDecorator() principal: any, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.royaltyService.getRoyaltiesByUser(principal.sub),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}