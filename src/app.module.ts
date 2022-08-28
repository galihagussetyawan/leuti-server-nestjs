import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { CartModule } from './cart/cart.module';
import { MysqlDatabaseConnectionConfig } from './commons/config/database/mysql-database-connection.config';
import { ImageModule } from './image/image.module';
import { OrderModule } from './order/order.module';
import { PointModule } from './point/point.module';
import { ProductModule } from './product/product.module';
import { RolesGuard } from './role/guard/roles.guard';
import { RoleModule } from './role/role.module';
import { ShippingModule } from './shipping/shipping,module';
import { UserDetailModule } from './user-detail/user-detail.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [

    TypeOrmModule.forRootAsync({
      useClass: MysqlDatabaseConnectionConfig,
    }),

    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      isGlobal: true,
    }),

    UserModule,
    AuthModule,
    RoleModule,
    UserDetailModule,
    ProductModule,
    CartModule,
    OrderModule,
    PointModule,
    ImageModule,
    ShippingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
