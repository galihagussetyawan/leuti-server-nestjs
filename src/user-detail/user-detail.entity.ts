import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users_details' })
export class UserDetailEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'address' })
    address: string;

    @Column({ name: 'country' })
    country: string;

    @Column({ name: 'province' })
    province: string;

    @Column({ name: 'city' })
    city: string;

    @Column({ name: 'districts' })
    districts: string;

    @Column({ name: 'village' })
    village: string;

    @Column({ name: 'postal_code' })
    postalCode: number;

    @Column({ name: 'phone' })
    phone: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;
}