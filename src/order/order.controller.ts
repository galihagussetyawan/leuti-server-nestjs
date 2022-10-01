import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
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
                data: await this.orderService.getOrderById(Number(id), principal.sub),
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
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

    @Put('order/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async approveOrder(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: `order by id: ${id} success approved`,
                data: await this.orderService.approveOrder(Number(id)),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })
        }
    }

    @Put('order/in-packaging')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async updateOrderStatusInPackagingById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: `success update status IN-PACKAGING order id #${id}`,
                data: await this.orderService.updateStatusOrderInPackagingById(id?.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Put('order/in-shipping')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async updateOrderStatusInShippingById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: `success update status IN-SHIPPING order id #${id}`,
                data: await this.orderService.updateStatusOrderInShippingById(id?.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Put('order/complete')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async completeOrderById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: `success completed order id #${id}`,
                data: await this.orderService.completeOrderById(Number(id)),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Put('order/cancel')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async cancelOrderById(@Req() req: Request, @Res() res: Response) {

        try {

            const { id } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                message: `canceled order id #${id}`,
                data: await this.orderService.cancelOrderById(Number(id)),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('orders/search')
    async searchOrders(@Req() req: Request, @Res() res: Response) {

        try {

            const { id, status } = req?.query;

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.orderService.searchOrders(Number(id), status?.toString()),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    //count order
    @Get('orders/new/count')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getCountNewOrders(@Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.orderService.getCountNewOrders(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('orders/now/count')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getCountNowOrders(@Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.orderService.getCountNowOrders(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }

    @Get('orders/total')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getTotalOrders(@Res() res: Response) {

        try {

            res.status(HttpStatus.OK).send({
                status: HttpStatus.OK,
                data: await this.orderService.getTotalOrders(),
            })

        } catch (error) {

            res.status(error.status).send({
                status: error.status,
                error_message: error.message,
            })

        }
    }
}