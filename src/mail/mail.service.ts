import { MailerService } from "@nestjs-modules/mailer";
import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderEntity } from "src/order/order.entity";
import { ShippingEntity } from "src/shipping/shipping.entity";

@Injectable()
export class MailService {

    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async sendEmailOrderCreatedToAgent(to: string, from: string, order: OrderEntity) {

        try {

            await this.mailerService.sendMail({
                to: to,
                from: from,
                subject: 'Order Product',
                template: 'order',
                context: {
                    title: 'Order Success Created',
                    id: order?.id,
                    status: order?.status,
                    created: new Date(Number(order?.createdAt)).toLocaleDateString('id', { dateStyle: 'long' }),
                    username: order?.user?.username,
                    carts: order?.carts,
                    subtotal: order?.amount,
                    total: order?.amount,
                }
            })

            return 'success send';

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async sendEmailOrderCreatedToAdmin(from: string, order: OrderEntity, shippingRequestBody: ShippingEntity) {

        try {

            await this.mailerService.sendMail({
                to: 'galihdevelopment@gmail.com',
                from: from,
                subject: 'Order Incoming',
                template: 'order-to-admin',
                context: {
                    id: order?.id,
                    status: order?.status,
                    created: new Date(Number(order?.createdAt)).toLocaleDateString('id', { dateStyle: 'long' }),
                    total: order?.amount,
                    subtotal: order?.amount,
                    username: order?.user?.username,
                    carts: order?.carts,
                    shipping: shippingRequestBody,

                }
            })

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}