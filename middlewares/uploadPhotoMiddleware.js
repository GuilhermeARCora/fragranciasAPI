const multer = require('multer');
const AppError = require('../utils/appError');

const uploadPhoto = function (destinationFolder, fileName) {

    const multerStorage =  multer.diskStorage ({
        destination: (req,file,cb) => {
            cb(null, `public/img/${destinationFolder}`);
        },
        filename: (req,file,cb) => {
            const ext = file.mimetype.split('/')[1];
            cb(null, `${fileName}-${req.user.id}-${Date.now()}.${ext}`);
        }
    });

    const multerFilter = (req,file,cb) => {
        if(file.mimetype.startsWith('image')){
            cb(null,true)
        }else{
            cb(new AppError('Not an image, please upload only images!', 400), false);
        }
    };

    const upload = multer({
        storage: multerStorage,
        fileFilter: multerFilter
    });

    return upload.single('photo');
};

module.exports = uploadPhoto;