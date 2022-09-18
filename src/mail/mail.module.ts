import { MailerModule, } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "src/order/order.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity]),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.SYSTEM_EMAIL_HOST,
                    secure: true,
                    auth: {
                        user: process.env.SYSTEM_EMAIL_USER,
                        pass: process.env.SYSTEM_EMAIL_PASS,
                    }
                },
                template: {
                    dir: process.cwd() + '/templates/',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    }
                }
            })
        }),

    ],
    providers: [MailService],
    controllers: [MailController],
    exports: [MailService, TypeOrmModule],

})
export class MailModule { }