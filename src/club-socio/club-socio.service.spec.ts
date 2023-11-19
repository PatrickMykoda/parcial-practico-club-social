import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity/club.entity';
import { SocioEntity } from '../socio/socio.entity/socio.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList : SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();
 
    sociosList = [];
    for(let i = 0; i < 5; i++){
      const socio: SocioEntity = await socioRepository.save({
      usuario: faker.person.firstName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past()})
      sociosList.push(socio);
    }
 
    club = await clubRepository.save({
      nombre: faker.company.name(),
      fecha_fundacion: faker.date.past(),
      imagen: faker.internet.url(),
      descripcion: faker.lorem.sentence(),
      socios: sociosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSocioClub should add a socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.person.firstName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past()
    });
 
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fecha_fundacion: faker.date.past(),
      imagen: faker.internet.url(),
      descripcion: faker.lorem.sentence()
    })
 
    const result: ClubEntity = await service.addSocioClub(newClub.id, newSocio.id);
   
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].usuario).toBe(newSocio.usuario)
    expect(result.socios[0].fecha_nacimiento).toStrictEqual(newSocio.fecha_nacimiento)
    expect(result.socios[0].email).toBe(newSocio.email)
  });

  it('addSocioClub should throw an exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fecha_fundacion: faker.date.past(),
      imagen: faker.internet.url(),
      descripcion: faker.lorem.sentence()
    })
 
    await expect(() => service.addSocioClub(newClub.id, "0")).rejects.toHaveProperty("message", "El socio con el ID indicado no fue encontrado");
  });

  it('addSocioClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.person.firstName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past()
    });
 
    await expect(() => service.addSocioClub("0", newSocio.id)).rejects.toHaveProperty("message", "El club con el ID indicado no fue encontrado");
  });

  it('findSocioByClubIdSocioId should return socio by club', async () => {
    const socio: SocioEntity = sociosList[0];
    const storedSocio: SocioEntity = await service.findSocioByClubIdSocioId(club.id, socio.id)
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toBe(socio.usuario);
    expect(storedSocio.fecha_nacimiento).toStrictEqual(socio.fecha_nacimiento);
    expect(storedSocio.email).toBe(socio.email);
  });

  it('findSocioByClubIdSocioId should throw an exception for an invalid socio', async () => {
    await expect(()=> service.findSocioByClubIdSocioId(club.id, "0")).rejects.toHaveProperty("message", "El socio con el ID indicado no fue encontrado");
  });

  it('findSocioByClubIdSocioId should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(()=> service.findSocioByClubIdSocioId("0", socio.id)).rejects.toHaveProperty("message", "El club con el ID indicado no fue encontrado");
  });

  it('findSocioByClubIdSocioId should throw an exception for a socio not associated to the club', async () => {
    const socio: SocioEntity = await socioRepository.save({
      usuario: faker.person.firstName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past()
    });
 
    await expect(()=> service.findSocioByClubIdSocioId(club.id, socio.id)).rejects.toHaveProperty("message", "El socio con el ID indicado no está asociado al club");
  });

  it('findSociosByClubId should return socios by club', async ()=>{
    const socios: SocioEntity[] = await service.findSociosByClubId(club.id);
    expect(socios.length).toBe(5)
  });

  it('findSociosByClubId should throw an exception for an invalid club', async () => {
    await expect(()=> service.findSociosByClubId("0")).rejects.toHaveProperty("message", "El club con el ID indicado no fue encontrado");
  });

  it('associateSociosClub should update socios list for a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.person.firstName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past()
    });
 
    const updatedClub: ClubEntity = await service.associateSociosClub(club.id, [newSocio]);
    expect(updatedClub.socios.length).toBe(1);
    expect(updatedClub.socios[0].usuario).toBe(newSocio.usuario);
    expect(updatedClub.socios[0].fecha_nacimiento).toBe(newSocio.fecha_nacimiento);
    expect(updatedClub.socios[0].email).toBe(newSocio.email);
  });

  it('associateSociosClub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.person.firstName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past()
    });
 
    await expect(()=> service.associateSociosClub("0", [newSocio])).rejects.toHaveProperty("message", "El club con el ID indicado no fue encontrado");
  });

  it('associateSociosClub should throw an exception for an invalid socio', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = "0";
 
    await expect(()=> service.associateSociosClub(club.id, [newSocio])).rejects.toHaveProperty("message", "El socio con el ID indicado no fue encontrado");
  });

  it('deleteSocioFromClub should remove a socio from a club', async () => {
    const socio: SocioEntity = sociosList[0];
   
    await service.deleteSocioFromClub(club.id, socio.id);
 
    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
    const deletedSocio: SocioEntity = storedClub.socios.find(s => s.id === socio.id);
 
    expect(deletedSocio).toBeUndefined();
  });

  it('deleteSocioFromClub should throw an exception for an invalid socio', async () => {
    await expect(()=> service.deleteSocioFromClub(club.id, "0")).rejects.toHaveProperty("message", "El socio con el ID indicado no fue encontrado");
  });

  it('deleteSocioFromClub should throw an exception for an invalid club', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(()=> service.deleteSocioFromClub("0", socio.id)).rejects.toHaveProperty("message", "El club con el ID indicado no fue encontrado");
  });

  it('deleteSocioFromClub should thrown an exception for an non asocciated socio', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.person.firstName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past()
    });
 
    await expect(()=> service.deleteSocioFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "El socio con el ID indicado no está asociado al club");
  });
});
