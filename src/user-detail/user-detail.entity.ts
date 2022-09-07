import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ name: 'district' })
    district: string;

    @Column({ name: 'village' })
    village: string;

    @Column({ name: 'postal_code' })
    postalCode: number;

    @Column({ name: 'phone' })
    phone: string;

    @Column({ name: 'createdAt' })
    createdAt: string;

    @Column({ name: 'updatedAt' })
    updatedAt: string;
}