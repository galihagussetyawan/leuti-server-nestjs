import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MysqlDatabaseConnectionConfig } from './commons/config/database/mysql-database-connection.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [

    TypeOrmModule.forRootAsync({
      useClass: MysqlDatabaseConnectionConfig
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
