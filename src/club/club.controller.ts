import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ClubService } from './club.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClubDto } from './club.dto/club.dto';
import { ClubEntity } from './club.entity/club.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
    constructor(private readonly clubService: ClubService) {}

    @Get()
    async findAll() {
        return await this.clubService.findAll();
    }

    @Get(':clubId')
    async findOne(@Param('clubId') clubId: string) {
        return await this.clubService.findOne(clubId);
    }

    @Post()
    async create(@Body() clubDto: ClubDto) {
        var regex = /^(17|18|19|20)\d{2}-(0[1-9]|1[1,2])-(0[1-9]|[12][0-9]|3[01])$/g;
        if (!regex.test(clubDto["fecha_fundacion"]))
            throw new BusinessLogicException("Fecha incorrecta: Se requiere el formato yyyy-mm-dd", BusinessError.PRECONDITION_FAILED);
        const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
        return await this.clubService.create(club);
    }

    @Put(':clubId')
    async update(@Param('clubId') clubId: string, @Body() clubDto: ClubDto) {
        var regex = /^(17|18|19|20)\d{2}-(0[1-9]|1[1,2])-(0[1-9]|[12][0-9]|3[01])$/g;
        if (!regex.test(clubDto["fecha_fundacion"]))
            throw new BusinessLogicException("Fecha incorrecta: Se requiere el formato yyyy-mm-dd", BusinessError.PRECONDITION_FAILED);
        const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
        return await this.clubService.update(clubId, club);
    }

    @Delete(':clubId')
    @HttpCode(204)
    async delete(@Param('clubId') clubId: string) {
        return await this.clubService.delete(clubId);
    }
}
