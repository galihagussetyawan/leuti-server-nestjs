import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }

  getHello(): string {

    console.log(this.configService.get<string>('MYSQL_HOST'));

    return process.env.DB_HOST;
  }
}