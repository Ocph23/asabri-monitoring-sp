const express=require('express');
const router =express.Router();
const authJwt = require('../auth/verifyToken');
const db = require('../db');


router.get('/',async (req,res)=>{
    try {
        const data = await db.Asuransi.get();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id',async (req,res)=>{
    try {

        var id=req.params["id"];
        const data = await db.Asuransi.getById(id);
        res.status(200).json({
           data:data
        });
    } catch (error) {
        console.log(error);
    }
});



router.post('/',async (req,res)=>{
    try {
        const asuransi = req.body;
        db.Asuransi.insertAsuransi(asuransi)
        .then(data=>{
            res.status(200).json(data);
        },err=>{
            res.status(500).json(err);
        });
       
    } catch (error) {
        res.status(200).json(error);
    }
});


router.post('/manfaat',async (req,res)=>{
    try {
        const manfaat = req.body;
        db.Asuransi.insertManfaat(manfaat)
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
        db.Asuransi.updateAsuransi(body)
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



router.put('/manfaat/:id',async (req,res)=>{
    try {
        const body = req.body;
        const id = req.params['id'];
        db.Asuransi.updateManfaat(body)
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
        db.Asuransi.deleteAsurnasi(id).then(result=>{
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



router.delete('/manfaat/:id',async (req,res)=>{
    try {
        const id = req.params['id'];
        db.Asuransi.deleteManfaat(id).then(result=>{
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