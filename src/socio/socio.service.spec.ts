import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity/socio.entity';
import { SocioService } from './socio.service';
import { faker } from '@faker-js/faker';


describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let sociosList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await repository.save({
        usuario: faker.person.firstName(),
        email: faker.internet.email(),
        fecha_nacimiento: faker.date.past()})
        sociosList.push(socio);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('findOne should return a socio by id', async () => {
    const storedSocio: SocioEntity = sociosList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.usuario).toEqual(storedSocio.usuario)
    expect(socio.fecha_nacimiento).toEqual(storedSocio.fecha_nacimiento)
    expect(socio.email).toEqual(storedSocio.email)
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El socio con el ID indicado no fue encontrado")
  });

  it('create should return a new socio', async () => {
    const socio: SocioEntity = {
      id: "",
      usuario: faker.person.firstName(),
      fecha_nacimiento: faker.date.past(),
      email: faker.internet.email(),
      clubs: []
    }
 
    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();
 
    const storedSocio: SocioEntity = await repository.findOne({where: {id: newSocio.id}})
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toEqual(newSocio.usuario)
    expect(storedSocio.fecha_nacimiento).toEqual(newSocio.fecha_nacimiento)
    expect(storedSocio.email).toEqual(newSocio.email)
  });

  it('create should throw an exception for an invalid e-mail', async () => {
    const socio: SocioEntity = {
      id: "",
      usuario: faker.person.firstName(),
      fecha_nacimiento: faker.date.past(),
      email: faker.word.noun(),
      clubs: []
    }
    await expect(() => service.create(socio)).rejects.toHaveProperty("message", "El correo electrónico no tiene el formato requerido")
  });

  it('update should modify a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    socio.usuario = "New name";
    socio.fecha_nacimiento = faker.date.past();
    socio.email = "new@mail.com";
    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();
    const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toEqual(socio.usuario)
    expect(storedSocio.fecha_nacimiento).toEqual(socio.fecha_nacimiento)
    expect(storedSocio.email).toEqual(socio.email)
  });

  it('update should throw an exception for an invalid socio', async () => {
    let socio: SocioEntity = sociosList[0];
    socio = {
      ...socio, usuario: "New name", fecha_nacimiento: faker.date.past(), email: "new@mail.com"
    }
    await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "El socio con el ID indicado no fue encontrado")
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await service.delete(socio.id);
    const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    const socio: SocioEntity = sociosList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El socio con el ID indicado no fue encontrado")
  });
});
