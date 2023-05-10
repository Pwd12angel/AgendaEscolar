//Utilizaremos el esquema de mongoose
const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const datos = new Schema(
  {
    tarea:String,
    descripcion:String,
    fecha: Date,
    url:String,
    done: {
      type: Boolean,
      default: false
    },
    //le decimos el uruario que va a guardar
    creador: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
    },
  },
  {
    timestamps: true,
    versionKey: false //__v de mongo , se lo eliminamo 
  }
);

const form = mongoose.model("eventos", datos);

module.exports = form;
