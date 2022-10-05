export class RankingPlayer 
{
    fecha:string = "";
    mail:string = "";
    puntuacion:number = 0;

    constructor(fechaRecibida:string, mailRecibido:string, puntuacionRecibida:number)
    {
        this.fecha = fechaRecibida;
        this.mail = mailRecibido;
        this.puntuacion = puntuacionRecibida;
    }
}
