import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {

  getHello(): string {
    return process.env.DB_HOST;
  }
}