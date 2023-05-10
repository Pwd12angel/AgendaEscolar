const mongoose = require("mongoose");
const {Schema} = mongoose;

const clase = new Schema({
    nombreclase: String,
    profesor: String,
    hora: String,
    dia: String,
    edificio: String,
    aula:String,
    //le decimos el uruario que va a guardar
    creador: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
      },
 }
);

const clases = mongoose.model("clase",clase);


module.exports = clases;