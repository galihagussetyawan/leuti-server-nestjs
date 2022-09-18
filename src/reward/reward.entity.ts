import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'reward' })
export class RewardEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'point' })
    point: number;

    @Column({ name: 'duration' })
    duration: number;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string
}