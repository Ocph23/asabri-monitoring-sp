const express=require('express');
const router =express.Router();
const authJwt = require('../auth/verifyToken');
const db = require('../db');


router.get('/',[authJwt.verifyToken],async (req,res)=>{
    try {
        const data = await db.Bank.get();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id',async (req,res)=>{
    try {

        var id=req.params["id"];
        const data = await db.Bank.getById(id);
        res.status(200).json({
           data:data
        });
    } catch (error) {
        console.log(error);
    }
});



router.post('/',async (req,res)=>{
    try {
        const bank = req.body;
        db.Bank.insert(bank)
        .then(data=>{
            res.status(200).json(data);
        },err=>{
            res.status(500).json(err);
        });
       
    } catch (error) {
        res.status(200).json(error);
    }
});


router.put('/:id',async (req,res)=>{
    try {
        const body = req.body;
        const id = req.params['id'];
        db.Bank.update(body)
        .then(data=>{
            res.status(200).json({
                data:data
             });
        },err=>{
            res.status(500).json(err);
        });
       
    } catch (error) {
        res.status(200).json(error);
    }
});

router.delete('/:id',async (req,res)=>{
    try {
        const id = req.params['id'];
        db.Bank.delete(id).then(result=>{
            if(result){
                res.status(200).json({
                    data:result
                 });
            }
        },err=>{
            res.status(400).json({
                message:"Data Tidak Terhapus"
             }); 
        });
     
    } catch (error) {
        console.log(error);
    }
});


module.exports=router;