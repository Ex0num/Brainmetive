export class Pregunta 
{
    link_api_img:string;
    pregunta:string;
    opciones = new Array();
    nroOpcionCorrecta:number;

    constructor (link_api_imgRecibido:string, preguntaRecibida:string, opcionesRecibidas:[string], nroOpcionCorrectaRecibida:number)
    {
        this.link_api_img =  link_api_imgRecibido;
        this.pregunta = preguntaRecibida;
        this.nroOpcionCorrecta = nroOpcionCorrectaRecibida;
        this.opciones = opcionesRecibidas;
    }
}