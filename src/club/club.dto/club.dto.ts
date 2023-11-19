import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class ClubDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly fecha_fundacion: string;
    
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
    
    @IsUrl()
    @IsNotEmpty()
    readonly imagen: string;
}
