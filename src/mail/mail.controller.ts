import { Controller, Get, Render } from "@nestjs/common";
import { MailService } from "./mail.service";

@Controller('api')
export class MailController {

    constructor(
        private readonly mailService: MailService,
    ) { }
}