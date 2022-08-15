import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'points' })
export class PointEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'point', default: 0 })
    point: number;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;
}