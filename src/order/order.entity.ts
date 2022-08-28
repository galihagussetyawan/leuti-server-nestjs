import { CartEntity } from "src/cart/cart.entity";
import { ShippingEntity } from "src/shipping/shipping.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'orders' })
export class OrderEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'amount', default: 0 })
    amount: number;

    @Column({ name: 'status', default: 'processed' })
    status: string;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @ManyToOne(() => UserEntity, { cascade: true })
    user: UserEntity;

    @ManyToMany(() => CartEntity, { cascade: true })
    @JoinTable()
    carts: CartEntity[];

    @ManyToOne(() => ShippingEntity, { cascade: true })
    shipping: ShippingEntity;
}