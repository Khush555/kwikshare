const router = require('express').Router();
const multer=require('multer');
const path = require('path');
const File = require('../models/file');
const {v4: uuid4 } = require('uuid');
const { runInNewContext } = require('vm');


let storage = multer.diskStorage({
    destination: (req,file,cb)=> cb(null,'uploads/'),
    filename: (req,file,cb) =>{
        const uniquename=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniquename);
    } 
})

let upload = multer({
    storage,
    limit: {fileSize: 1000000*100},
}).single('myfile');

router.post('/',(req,res)=>{
    
    
    //store file in uploads
    upload(req,res,async (err)=>{
        if(err){
            return res.status(500).send({error: err.message})
        }
        //Validate request
        
    
        
        //Store into Database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });

        const response = await file.save();
        return res.json({file: `https://kwikshare.herokuapp.com/files/${response.uuid}`});
        // http://localhost:3000/files/23463gjgjf-3jjdk    
    })

    


    
})
router.post('/send',async (req,res)=>{
    
    const { uuid , emailTo, emailFrom,expiresIn}= req.body;
    //Validate request
    if(!uuid||!emailTo||!emailFrom){
        return res.status(422).send({error:'All fields are required.'});

    }
    //Get data from database
    try{
    const file = await File.findOne({uuid : uuid});
    if(file.sender){
        return res.status(422).send({error:'Email already sent.'});
    }
    file.sender = emailFrom;
    file.receiver= emailTo;
    const response = await file.save();

    //Send Email
    const sendMail = require('../services/emailService');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'KwikShare - A new file was shared with you',
        text: `${emailFrom} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `https://kwikshare.herokuapp.com/files/${file.uuid}?source=email`,
            size: parseInt(file.size/1000)+'KB',
            expires: '24 hours'
        })
    }).then(()=>{
        return res.json({success: true});
    }).catch(err=>{
        console.log(err);
        return res.status(500).json({error: 'Error in email sending.'});
    });
} catch(err){
    console.log(err);
    return res.status(500).send({error:'Something went wrong.'});
}

    
})
module.exports= router;
