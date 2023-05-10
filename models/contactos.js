const mongoose = require("mongoose");
const {Schema} = mongoose;

const contac = new Schema(
    {
        nombre:{
            type:String
        },
        apellido:{
            type:String
        },
        numero:{
            type:Number
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

const contacto = mongoose.model("contacto",contac);


module.exports = contacto;