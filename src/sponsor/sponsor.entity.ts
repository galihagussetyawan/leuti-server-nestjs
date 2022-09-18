import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'sponsor' })
export class SponsorEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UserEntity, (user) => user.sponsor, { cascade: true })
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => UserEntity, { cascade: true, nullable: true })
    upline: UserEntity;

    @ManyToMany(() => UserEntity, { nullable: true, cascade: true })
    @JoinTable()
    downline: UserEntity[];

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;
}