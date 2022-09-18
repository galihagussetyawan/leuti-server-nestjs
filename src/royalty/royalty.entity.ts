import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'royalty' })
export class RoyaltyEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, (user) => user.royalty, { cascade: true })
    @JoinColumn()
    user: UserEntity;

    @Column({ name: 'amount' })
    amount: number;

    @Column({ name: 'withdraw', default: false })
    withdraw: boolean;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;
}