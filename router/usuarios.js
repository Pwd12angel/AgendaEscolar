const express = require('express');
const router = express.Router();

//nos traemos el modelo
const Usuario = require('../models/usuario');


router.get('/', async(req,res)=>{

    try {
        const arrayUsuariodb = await Usuario.find();
        console.log("Error que manda"+arrayUsuariodb);

        res.render("usuarios",{
            arrayUsuarios : arrayUsuariodb
         });
    } catch (error) {
        console.log(error);
    }
});


//exportamos 
module.exports = router;