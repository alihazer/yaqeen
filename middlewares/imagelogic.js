const multer =require('multer');

// to add the image in images file and add an unique name
const diskStorage =multer.diskStorage({
    // to add in folder
    destination: function(req,file,cb){
        cb(null,'images');
    },
    // to add an unique name 
    filename: function(req,file,cb){
        const extention=file.mimetype.split('/')[1];         
        const filename=`user-${Date.now()}.${extention}`;
        cb(null,filename)

    }
});

// for fiter type og files anf accept just images
const fileFilter =(req,file,cb)=>{
    const imageType=file.mimetype.split('/')[0];

    if (imageType ==='image') {
        return cb(null,true)
    } else {
        return cb(new Error('Only images are allowed!'),false)
    }
}

const images=multer({
    storage: diskStorage,
    fileFilter,
});

module.exports=images;