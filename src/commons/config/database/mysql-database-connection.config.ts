import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

export class MysqlDatabaseConnectionConfig implements TypeOrmOptionsFactory {

    createTypeOrmOptions(): TypeOrmModuleOptions {

        try {
            return {
                name: 'default',
                type: 'mariadb',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                synchronize: true,
                dropSchema: false,
                logging: false,
                autoLoadEntities: true,
                entities: ['dist/**/*.entity.js'],
            };
        } catch (error) {
            throw new Error(error.message);
        }

    }

}