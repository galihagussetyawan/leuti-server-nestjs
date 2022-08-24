import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() { }

  getHello(): string {

    return process.env.DB_HOST;
  }
}