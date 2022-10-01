import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { MysqlDatabaseConnectionConfig } from './commons/config/database/mysql-database-connection.config';
import { CronJobModule } from './cron-job/cron-job.module';
import { DiscountModule } from './discount/discount.module';
import { ImageModule } from './image/image.module';
import { MailModule } from './mail/mail.module';
import { OrderModule } from './order/order.module';
import { PointModule } from './point/point.module';
import { ProductModule } from './product/product.module';
import { RewardClaimModule } from './reward-claim/reward-claim.module';
import { RewardModule } from './reward/reward.module';
import { RoleModule } from './role/role.module';
import { RoyaltyModule } from './royalty/royalty.module';
import { ShippingModule } from './shipping/shipping,module';
import { SponsorModule } from './sponsor/sponsor.module';
import { UserDetailModule } from './user-detail/user-detail.module';
import { UserModule } from './user/user.module';
import { WithdrawModule } from './withdraw/withdraw.module';

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
    DiscountModule,
    RewardModule,
    MailModule,
    RewardClaimModule,
    SponsorModule,
    RoyaltyModule,
    WithdrawModule,
    CronJobModule,

  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }
