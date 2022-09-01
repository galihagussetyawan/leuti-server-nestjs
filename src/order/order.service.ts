import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "src/cart/cart.entity";
import { PointEntity } from "src/point/point.entity";
import { ProductEntity } from "src/product/product.entity";
import { ShippingEntity } from "src/shipping/shipping.entity";
import { UserEntity } from "src/user/user.entity";
import { In, Like, Repository } from "typeorm";
import { OrderEntity } from "./order.entity";

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(ShippingEntity) private shippingRepository: Repository<ShippingEntity>,
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        @InjectRepository(PointEntity) private pointRepository: Repository<PointEntity>,
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

            if (carts?.length === 0) {
                throw new NotFoundException('cart kosong');
            }

            await carts?.forEach(data => {

                if (data?.quantity > data?.product?.stock) {
                    throw new BadRequestException(`Cek produk tersisa`);
                }

            })

            const totalCartAmount = await carts.map(data => data.amount).reduce((prev, next) => prev + next);

            const product = carts.map(data => {
                data.product.stock = data?.product?.stock - data?.quantity;
                return data?.product;
            });

            // set cart if create order isvisibility, ischeckout = false
            carts.forEach(data => {
                data.visibility = false;
                data.checkout = false;

                return data;
            })

            const order = new OrderEntity();
            order.createdAt = Date.now().toString();
            order.user = user;
            order.carts = carts;
            order.amount = totalCartAmount;

            await this.productRepository.save(product);
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

            if (!order) {
                throw new NotFoundException('order not found');
            }

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

    async getAllOrders(status: string) {

        const statusCheck = () => {

            if (status === 'now-orders') {
                return ['approve', 'in-packaging', 'in-shipping'];
            }

            if (status === 'history-orders') {
                return ['completed', 'canceled'];
            }

            return ['created', 'unpaid'];
        }

        try {

            return await this.orderRepository.find({
                where: {
                    status: In(statusCheck())
                },
                relations: {
                    carts: {
                        product: true,
                    },
                    user: {
                        userDetail: true,
                    },
                    shipping: true,
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

            return await this.orderRepository.update(id, { shipping: shipping, status: 'unpaid' });

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    //seller function order service
    async cancelOrderById(id: string) {

        try {

            const order = await this.orderRepository.findOne({
                where: { id },
                relations: {
                    carts: {
                        product: true,
                    }
                }
            })

            const products = order?.carts?.map(data => {
                data.product.stock = data?.product?.stock + data?.quantity;
                return data?.product;
            })

            await this.productRepository.save(products);
            return await this.orderRepository.update(id, { status: 'canceled' });

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    async approveOrder(id: string) {

        try {

            const order = await this.orderRepository.findOne({
                where: { id },
                relations: {
                    user: true,
                    carts: true,
                },
            })
            const plusPoint = order?.carts.map(data => data?.quantity).reduce((prev, next) => prev + next);

            const point = await this.pointRepository.findOneBy({ user: order?.user });

            await this.pointRepository.update(point.id, { point: point?.point + plusPoint, updatedAt: Date.now().toString() });
            return await this.orderRepository.update(id, { status: 'approve' });

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async updateStatusOrderInPackagingById(id: string) {

        try {

            return await this.orderRepository.update(id, { status: 'in-packaging' })

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    async updateStatusOrderInShippingById(id: string) {

        try {

            return await this.orderRepository.update(id, { status: 'in-shipping' });

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    async completeOrderById(id: string) {

        try {

            return await this.orderRepository.update(id, { status: 'completed' });

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    async searchOrders(id: string, status: string) {

        const statusCheck = () => {

            if (status === 'now-orders') {
                return ['approve', 'in-packaging', 'in-shipping'];
            }

            if (status === 'history-orders') {
                return ['completed', 'canceled'];
            }

            return ['created', 'unpaid'];
        }

        try {

            const order = await this.orderRepository.find({
                where: {
                    id: id,
                    status: In(statusCheck()),
                },
                relations: {
                    carts: {
                        product: true,
                    },
                    user: {
                        userDetail: true,
                    },
                    shipping: true,
                },
                select: {
                    user: {
                        id: true,
                        username: true,
                    }
                },
                order: {
                    createdAt: 'DESC',
                }
            })

            return order;

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }
}