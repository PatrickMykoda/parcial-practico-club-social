import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from '../club/club.entity/club.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClubSocioService {
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,
    
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ) {}

    async addSocioClub(clubId: string, socioId: string): Promise<ClubEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ["clubs"]});
        if (!socio)
            throw new BusinessLogicException("El socio con el ID indicado no fue encontrado", BusinessError.NOT_FOUND);
      
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]})
        if (!club)
            throw new BusinessLogicException("El club con el ID indicado no fue encontrado", BusinessError.NOT_FOUND);
    
        club.socios = [...club.socios, socio];
        return await this.clubRepository.save(club);
    }

    async findSocioByClubIdSocioId(clubId: string, socioId: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ["clubs"]});
        if (!socio)
          throw new BusinessLogicException("El socio con el ID indicado no fue encontrado", BusinessError.NOT_FOUND)
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("El club con el ID indicado no fue encontrado", BusinessError.NOT_FOUND)
        const clubSocio: SocioEntity = club.socios.find(s => s.id === socio.id);
        if (!clubSocio)
          throw new BusinessLogicException("El socio con el ID indicado no está asociado al club", BusinessError.PRECONDITION_FAILED)
   
        return clubSocio;
    }

    async findSociosByClubId(clubId: string): Promise<SocioEntity[]> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("El club con el ID indicado no fue encontrado", BusinessError.NOT_FOUND)
       
        return club.socios;
    }

    async associateSociosClub(clubId: string, socios: SocioEntity[]): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
    
        if (!club)
          throw new BusinessLogicException("El club con el ID indicado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < socios.length; i++) {
          const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socios[i].id}});
          if (!socio)
            throw new BusinessLogicException("El socio con el ID indicado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        club.socios = socios;
        return await this.clubRepository.save(club);
      }

      async deleteSocioFromClub(clubId: string, socioId: string){
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}, relations: ["clubs"]});
        if (!socio)
          throw new BusinessLogicException("El socio con el ID indicado no fue encontrado", BusinessError.NOT_FOUND)
    
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socios"]});
        if (!club)
          throw new BusinessLogicException("El club con el ID indicado no fue encontrado", BusinessError.NOT_FOUND)
    
        const clubSocio: SocioEntity = club.socios.find(s => s.id === socio.id);
    
        if (!clubSocio)
            throw new BusinessLogicException("El socio con el ID indicado no está asociado al club", BusinessError.PRECONDITION_FAILED)
 
        club.socios = club.socios.filter(s => s.id !== socioId);
        await this.clubRepository.save(club);
    }  
}
