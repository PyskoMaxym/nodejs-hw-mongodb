import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.resolve("src", "tmp"));
    },
    filename: function(req, file, cb){
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null,  uniquePreffix + '-' + file.originalname);
    }
})

export const upload = multer({storage});

