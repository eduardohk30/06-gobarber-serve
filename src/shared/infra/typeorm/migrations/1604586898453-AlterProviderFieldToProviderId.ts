import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1604586898453
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('appointments', 'provider');
        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'provider_id',
                type: 'uuid',
                isNullable: true,
            }),
        );
        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                name: 'AppointmentProvider', // Qual o Nome do Relacionamento
                columnNames: ['provider_id'], // Qual a coluna que iremos relacionar
                referencedColumnNames: ['id'], // Qual a coluna referenciada na na tabela
                referencedTableName: 'users', // Qual a tabela que iremos referenciar
                onDelete: 'SET NULL', // Relacionamento ao deletar: deixar o campo nulo
                onUpdate: 'CASCADE', // Relacionamento ao atualizar: atualizaremos o campo em cascata
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

        await queryRunner.dropColumn('appointments', 'provider_id');

        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'provider',
                type: 'varchar',
            }),
        );
    }
}
