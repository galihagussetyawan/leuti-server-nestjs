import { CartEntity } from "src/cart/cart.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'orders' })
export class OrderEntity {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ name: 'amount' })
    amount: number;

    @Column({ name: 'status' })
    status: string;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @ManyToOne(() => UserEntity, { lazy: true, cascade: true })
    user: UserEntity;

    @OneToMany(() => CartEntity, (cart) => cart.order)
    @JoinTable()
    carts: Promise<CartEntity[]>
}