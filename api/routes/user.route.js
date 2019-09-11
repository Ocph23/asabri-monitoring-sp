const express=require('express');
const router =express.Router();

const contextDb = require('../../db');


router.get('/',async (req,res)=>{
    try {
        const data = await contextDb.getAll();
        res.status(200).json({
           data:data
        });
    } catch (error) {
        
    }


  
});

module.exports=router;
