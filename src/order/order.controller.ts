import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PrincipalDecorator } from "src/commons/decorators/principal.decorator";
import { Roles } from "src/role/decorator/roles.decorator";
import { RolesGuard } from "src/role/guard/roles.guard";
import { Role } from "src/role/role.enum";
import { ShippingEntity } from "src/shipping/shipping.entity";
import { OrderService } from "./order.service";

@Controller('api')
export class OrderController {

    constructor(
        private orderService: OrderService,
    ) { }

    @Post('order')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.AGENT)
    async createOrder(@PrincipalDecorator() principal: any, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: 'success create order',
                data: await this.orderService.createOrderByUser(principal?.sub),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('order')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.AGENT)
    async getOrderById(@Req() req: Request, @Res() res: Response, @PrincipalDecorator() principal: any) {

        try {

            const { id } = req.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.orderService.getOrderById(id.toString(), principal.sub),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }

    @Get('orders')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.AGENT)
    async getOrdersByUser(@PrincipalDecorator() principal: any, @Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.orderService.getOrdersByUser(principal?.sub)
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Post('order/shipping')
    async addShippingAddressOrder(@Req() req: Request, @Res() res: Response, @Body() shippingRequestBody: ShippingEntity) {

        try {

            const { id } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.orderService.addShippingAddressOrder(id.toString(), shippingRequestBody),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    //admin service
    @Get('orders/all')
    async getAllOrders(@Req() req: Request, @Res() res: Response,) {

        try {

            const { status } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.orderService.getAllOrders(status?.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }
}