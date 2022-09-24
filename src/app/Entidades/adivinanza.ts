export class Adivinanza 
{
    link_api_img:any;
    palabra:string;

    constructor(palabraRecibida:string, link_api_imgRecibido:string[])
    {
        this.palabra = palabraRecibida;
        this.link_api_img = link_api_imgRecibido;
    }
}
