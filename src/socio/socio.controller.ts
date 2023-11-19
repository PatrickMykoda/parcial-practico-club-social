import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SocioService } from './socio.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SocioDto } from './socio.dto/socio.dto';
import { SocioEntity } from './socio.entity/socio.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
    constructor(private readonly socioService: SocioService) {}

    @Get()
    async findAll() {
        return await this.socioService.findAll();
    }

    @Get(':memberId')
    async findOne(@Param('memberId') socioId: string) {
        return await this.socioService.findOne(socioId);
    }

    @Post()
    async create(@Body() socioDto: SocioDto) {
        var regex = /^(17|18|19|20)\d{2}-(0[1-9]|1[1,2])-(0[1-9]|[12][0-9]|3[01])$/g;
        if (!regex.test(socioDto["fecha_nacimiento"]))
            throw new BusinessLogicException("Fecha incorrecta: Se requiere el formato yyyy-mm-dd", BusinessError.PRECONDITION_FAILED);
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.create(socio);
    }

    @Put(':memberId')
    async update(@Param('memberId') socioId: string, @Body() socioDto: SocioDto) {
        var regex = /^(17|18|19|20)\d{2}-(0[1-9]|1[1,2])-(0[1-9]|[12][0-9]|3[01])$/g;
        if (!regex.test(socioDto["fecha_nacimiento"]))
            throw new BusinessLogicException("Fecha incorrecta: Se requiere el formato yyyy-mm-dd", BusinessError.PRECONDITION_FAILED);
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.update(socioId, socio);
    }

    @Delete(':memberId')
    @HttpCode(204)
    async delete(@Param('memberId') socioId: string) {
        return await this.socioService.delete(socioId);
    }
}

