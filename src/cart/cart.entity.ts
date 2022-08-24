import { OrderEntity } from "src/order/order.entity";
import { ProductEntity } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'carts' })
export class CartEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'quantity' })
    quantity: number;

    @Column({ name: 'amount' })
    amount: number;

    @Column({ name: 'isCheckout', default: true })
    checkout: boolean;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;

    @ManyToOne(() => UserEntity, { lazy: true })
    user: UserEntity;

    @ManyToOne(() => ProductEntity, { cascade: true })
    product: ProductEntity;

    @ManyToOne(() => OrderEntity, (order) => order.carts, { lazy: true })
    order: OrderEntity;
}