import { RewardEntity } from "src/reward/reward.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'reward_claim' })
export class RewardClaimEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, { cascade: true })
    user: UserEntity;

    @ManyToOne(() => RewardEntity, { cascade: true })
    reward: RewardEntity;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;
}