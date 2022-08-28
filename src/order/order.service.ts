import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "src/cart/cart.entity";
import { ShippingEntity } from "src/shipping/shipping.entity";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { OrderEntity } from "./order.entity";

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ShippingEntity) private shippingRepository: Repository<ShippingEntity>,
    ) { }

    async createOrderByUser(userid: string) {

        try {

            const user = await this.userRepository.findOneBy({ id: userid });
            const carts = await this.cartRepository.find({
                where: {
                    user,
                    checkout: true,
                },
                relations: {
                    product: true,
                }
            })

            if (carts.length === 0) {
                throw new NotFoundException('cart kosong');
            }

            carts?.forEach(data => {

                if (data?.quantity > data?.product?.stock) {
                    throw new BadRequestException(`Cek produk tersisa`);
                }

            })

            const totalCartAmount = await carts.map(data => data.amount).reduce((prev, next) => prev + next);

            const order = new OrderEntity();
            order.createdAt = Date.now().toString();
            order.user = user;
            order.carts = carts;
            order.amount = totalCartAmount;

            carts.forEach(async data => await this.cartRepository.update(data.id, { checkout: false, visibility: false }));
            return await this.orderRepository.save(order);

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async getOrderById(id: string, userid: string) {

        try {

            const order = await this.orderRepository.findOne({
                where: { id },
                relations: {
                    carts: {
                        product: {
                            images: true,
                        }
                    },
                    user: true,
                },
                select: {
                    user: {
                        id: true,
                        username: true,
                    }
                }
            })

            if (order?.user?.id !== userid) {
                throw new ForbiddenException('forbidden');
            }

            return order;

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    async getOrdersByUser(userid: string) {

        try {

            return await this.orderRepository.find({
                where: {
                    user: { id: userid }
                },
                relations: {
                    user: true,
                    carts: {
                        product: {
                            images: true,
                        }
                    }
                },
                select: {
                    user: {
                        username: true,
                        id: true,
                    }
                },
                order: {
                    createdAt: 'DESC',
                }
            })

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async getAllOrders(status: string = 'processed',) {

        try {

            return await this.orderRepository.find({
                where: {
                    status: status,
                },
                relations: {
                    carts: true,
                    user: {
                        userDetail: true,
                    }
                },
                select: {
                    user: {
                        id: true,
                        username: true,
                    },
                },
                order: {
                    createdAt: 'DESC',
                }
            })

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    //agent fundction order service
    async addShippingAddressOrder(id, shippingRequestBody: ShippingEntity) {

        try {

            shippingRequestBody.createdAt = Date.now().toString();
            shippingRequestBody.updatedAt = Date.now().toString();

            const shipping = await this.shippingRepository.save(shippingRequestBody);

            return await this.orderRepository.update(id, { shipping: shipping });

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    //seller function order service
    async acceptOrder(id: string) {

        try {

            const order = await this.orderRepository.findOne({
                where: {
                    id
                },
                relations: {
                    carts: {
                        product: true,
                    },
                    user: true,
                }
            })

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }
}