import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'withdraw' })
export class WithdrawEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'amount' })
    amount: number;

    @ManyToOne(() => UserEntity, (user) => user.withdraw)
    user: UserEntity;

    @Column({ name: 'status', default: 'on-process' })
    status: string;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;
}