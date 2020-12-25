import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/Users';

/**
 * Indica que a classe Appointment equivale à tabela
 * appointments no banco de dados
 */
@Entity('appointments')
class Appointment {
    /*
     * Indica que o id é um campo do tipo primário e gerado
     * automaticamente, utilizando do padrão uuid para
     * geração de ids
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /*
     * Indica que é uma coluna da tabela appointments
     */
    @Column()
    provider_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'provider_id' })
    provider: User;

    /*
     * Indica que é uma coluna da tabela appointments
     * do tipo timestamp with time zone
     */
    @Column('timestamp with time zone')
    date: Date;

    /*
     * Essa função CreateDateColumn irá se alimentar
     * automaticamente sempre que criarmos um registro
     * na tabela
     */
    @CreateDateColumn()
    created_at: Date;

    /*
     * Essa função UpdateDateColumn irá se alimentar
     * automaticamente sempre que um registro for
     * atualizado na tabela
     */
    @UpdateDateColumn()
    updated_at: Date;
}

export default Appointment;
