import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class ClubDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsDate()
    @IsNotEmpty()
    readonly fecha_fundacion: Date;
    
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
    
    @IsUrl()
    @IsNotEmpty()
    readonly imagen: string;
}
