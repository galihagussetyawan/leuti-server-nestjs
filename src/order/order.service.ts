import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CartEntity } from "src/cart/cart.entity";
import { MailService } from "src/mail/mail.service";
import { PointEntity } from "src/point/point.entity";
import { ProductEntity } from "src/product/product.entity";
import { RoyaltyEntity } from "src/royalty/royalty.entity";
import { ShippingEntity } from "src/shipping/shipping.entity";
import { UserEntity } from "src/user/user.entity";
import { In, LessThan, MoreThan, Repository } from "typeorm";
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
        @InjectRepository(RoyaltyEntity) private royaltyRepository: Repository<RoyaltyEntity>,
        private readonly mailService: MailService,
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
                    discount: true,
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

    async getOrderById(id: number, userid: string) {

        try {

            const order = await this.orderRepository.findOne({
                where: { id },
                relations: {
                    carts: {
                        product: {
                            images: true,
                        },
                        discount: true,
                    },
                    user: true,
                    shipping: true,
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
                return ['approved', 'in-packaging', 'in-shipping'];
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

            const order = await this.orderRepository.findOne({
                where: { id },
                relations: {
                    user: true,
                    carts: {
                        product: {
                            images: true,
                        },
                        discount: true,
                    }
                }
            })

            shippingRequestBody.createdAt = Date.now().toString();
            shippingRequestBody.updatedAt = Date.now().toString();

            await this.mailService.sendEmailOrderCreatedToAgent(order?.user?.email, `Leuti Team<${process.env.SYSTEM_EMAIL_USER}>`, order);
            await this.mailService.sendEmailOrderCreatedToAdmin(`Leuti Team<${process.env.SYSTEM_EMAIL_USER}>`, order, shippingRequestBody);

            const shipping = await this.shippingRepository.save(shippingRequestBody);
            return await this.orderRepository.update(id, { shipping: shipping, status: 'unpaid' });

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    //seller function order service
    async cancelOrderById(id: number) {

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

    async approveOrder(id: number) {

        try {

            const order = await this.orderRepository.findOne({
                where: { id },
                relations: {
                    user: true,
                    carts: true,
                },
            })

            const point = await this.pointRepository.findOneBy({ user: order?.user });

            if (order?.amount > 1000000) {
                await this.pointRepository.update(point.id, { point: point?.point + 10, updatedAt: Date.now().toString() });
            }
            // const plusPoint = order?.carts?.map(data => data?.quantity).reduce((prev, next) => prev + next);

            return await this.orderRepository.update(id, { status: 'approved' });

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

    async completeOrderById(id: number) {

        try {

            const order = await this.orderRepository.findOne({
                where: {
                    id
                },
                relations: {
                    user: {
                        sponsor: {
                            upline: true,
                        }
                    },
                    shipping: true,
                    carts: true,
                }
            })

            if (order.user.sponsor.upline) {

                let userTrackingList = [];
                let currentUserTracking = order.user.sponsor.upline;

                while (currentUserTracking && userTrackingList.length < 2) {

                    const currUser = await this.userRepository.findOne({
                        where: {
                            id: currentUserTracking.id
                        },
                        relations: {
                            sponsor: {
                                upline: true,
                            }
                        }
                    })

                    if (currUser.sponsor.upline) {
                        userTrackingList.push(currUser?.sponsor?.upline);
                    }

                    currentUserTracking = currUser?.sponsor?.upline;
                }

                console.log(userTrackingList);


                const listCreateRoyalty: RoyaltyEntity[] = [];
                let percent = 0;

                userTrackingList.forEach(data => {

                    percent = percent + 3;
                    const royalty = new RoyaltyEntity();

                    royalty.amount = (percent / 100) * order?.amount;
                    royalty.user = data;
                    royalty.createdAt = Date.now().toString();
                    royalty.updatedAt = Date.now().toString();

                    listCreateRoyalty.push(royalty);
                })

                // await this.royaltyRepository.save(listCreateRoyalty);
            }

            order.status = 'completed';
            // return await this.orderRepository.save(order);

        } catch (error) {

            throw new BadRequestException(error.message);

        }
    }

    async searchOrders(id: number, status: string) {

        const statusCheck = () => {

            if (status === 'now-orders') {
                return ['approved', 'in-packaging', 'in-shipping'];
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
                        discount: true,
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

    async getCountNewOrders() {

        try {

            return await this.orderRepository.count({
                where: {
                    status: In(['unpaid', 'created'])
                }
            })

        } catch (error) {

            throw new BadRequestException(error.message);
        }
    }

    async getCountNowOrders() {

        try {

            return await this.orderRepository.count({
                where: {
                    status: In(['approved', 'in-packaging', 'in-shipping'])
                }
            })

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getTotalOrders() {

        try {

            const today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setMilliseconds(0);

            const orders = await this.orderRepository.find({
                where: {
                    createdAt: MoreThan(today.getTime().toString()),
                    status: In(['approved', 'completed'])
                },
                relations: {
                    carts: true,
                },
                select: {
                    amount: true,
                    carts: true,
                },
            });

            return {
                amount: orders?.length === 0 ? 0 : await orders?.map(data => data?.amount).reduce((prev, next) => prev + next),
                quantity: orders.length === 0 ? 0 : await orders?.flatMap(data => data?.carts?.map(cart => cart?.quantity))?.reduce((prev, next) => prev + next),
            }

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}