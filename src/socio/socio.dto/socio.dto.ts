import {IsDate, IsEmail, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class SocioDto {
    @IsString()
    @IsNotEmpty()
    readonly usuario: string;

    @IsString()
    @IsNotEmpty()
    readonly fecha_nacimiento: string;
    
    @IsString()
    @IsNotEmpty()
    readonly email: string;
}
