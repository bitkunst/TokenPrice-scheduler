import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Token-Price' })
export class TokenPrice extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 10, nullable: false })
    token_symbol: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    token_price: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    price_source: string;

    @Column({ type: 'timestamp', nullable: true })
    timestamp: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    block_number: string;
}
