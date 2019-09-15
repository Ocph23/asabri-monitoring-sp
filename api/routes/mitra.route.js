const express=require('express');
const router =express.Router();
const db = require('../db');


router.get('/',async (req,res)=>{
    try {
        const data = await db.Mitra.get();

        data.forEach(async element => {
            element.bank= await db.Bank.getById(element.idBank);            
        });
        setTimeout(x=>{
            res.status(200).json(data);
        },3000);
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id',async (req,res)=>{
    try {

        var id=req.params["id"];
        const data = await db.Mitra.getById(id);
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
        db.Mitra.insert(bank)
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
        db.Mitra.update(body)
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
        db.Mitra.delete(id).then(result=>{
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