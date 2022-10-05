export class Encuesta 
{
    nombreYApellido:string = "";
    edad:number = 0;
    tipoPersona:string = "";
    recomendariasBrainmetive = "Sí";
    queCosasCumpleBrainmetive = [1,2,3];
    comentarioFinal = "";

    constructor(nombre_apellido_recibido:string, 
        edad_recibida:number, 
        tipo_persona_recibida:string, 
        recomendariasBrainmetive_recibido:string, 
        queCosasCumpleBrainmetive_recibido:[number],
        comentarioFinal_recibido:string)
    {
        this.nombreYApellido = nombre_apellido_recibido;
        this.edad = edad_recibida;
        this.tipoPersona = tipo_persona_recibida;
        this.recomendariasBrainmetive = recomendariasBrainmetive_recibido;
        this.queCosasCumpleBrainmetive = queCosasCumpleBrainmetive_recibido;
        this.comentarioFinal = comentarioFinal_recibido;
    }
}

