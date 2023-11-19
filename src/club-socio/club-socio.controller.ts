import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { SocioDto } from '../socio/socio.dto/socio.dto';
import { plainToInstance } from 'class-transformer';
import { SocioEntity } from 'src/socio/socio.entity/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {
    constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':clubId/members/:memberId')
    async addMemberToClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
       return await this.clubSocioService.addSocioClub(clubId, socioId);
    }

    @Get(':clubId/members/:memberId')
    async findMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
       return await this.clubSocioService.findSocioByClubIdSocioId(clubId, socioId);
    }

    @Get(':clubId/members')
    async findMembersFromClub(@Param('clubId') clubId: string){
       return await this.clubSocioService.findSociosByClubId(clubId);
    }

    @Put(':clubId/members')
    async updateMembersFromClub(@Body() sociosDto: SocioDto[], @Param('clubId') clubId: string){
       const socios = plainToInstance(SocioEntity, sociosDto)
       return await this.clubSocioService.associateSociosClub(clubId, socios);
    }

    @Delete(':clubId/members/:memberId')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') socioId: string){
       return await this.clubSocioService.deleteSocioFromClub(clubId, socioId);
    }
}
