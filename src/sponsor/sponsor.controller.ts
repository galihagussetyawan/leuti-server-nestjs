import { Controller, Delete, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PrincipalDecorator } from "src/commons/decorators/principal.decorator";
import { Roles } from "src/role/decorator/roles.decorator";
import { RolesGuard } from "src/role/guard/roles.guard";
import { Role } from "src/role/role.enum";
import { SponsorService } from "./sponsor.service";

@Controller('api')
export class SponsorController {

    constructor(
        private readonly sponsorService: SponsorService,
    ) { }

    @Post('sponsor')
    async createSponsor(@Req() req: Request, @Res() res: Response) {

        const { userid, userdownlineid } = req.query;

        res.send({
            data: await this.sponsorService.createSponsorDownline(userid.toString(), userdownlineid.toString()),
        })
    }

    @Post('sponsor/add')
    async addSponsorDownlineById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id, userdownlineid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success add downline agent',
                data: await this.sponsorService.addSponsorDownlineById(id.toString(), userdownlineid.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }

    @Delete('sponsor')
    async removeSponsorDownlineById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id, userdownlineid } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success remove downline agent',
                data: await this.sponsorService.removeSponsorDownlineById(id.toString(), userdownlineid.toString()),
            })


        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('sponsors')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.AGENT)
    async getAllSponsorsByUser(@PrincipalDecorator() principal: any, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.sponsorService.getAllSponsorsByUser(principal.sub),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}