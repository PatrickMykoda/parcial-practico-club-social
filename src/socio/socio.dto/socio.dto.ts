import {IsDate, IsEmail, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class SocioDto {
    @IsString()
    @IsNotEmpty()
    readonly usuario: string;

    @IsDate()
    @IsNotEmpty()
    readonly fecha_nacimiento: Date;
    
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}
