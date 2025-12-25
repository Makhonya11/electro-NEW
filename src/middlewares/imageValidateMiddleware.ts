import multer from "multer"
import path from 'path'
import {v4 as uuid} from 'uuid' 

const storage = multer.diskStorage({
  destination: 'uploads',
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = `${req.user.id}-${uuid()}${ext}`
    cb(null, filename)
  },
})


 export const uploadAvatarMiddleware = multer({
                    storage,
                    limits: {
                        fileSize: 2 * 1024 * 1024, // 2MB
                    },
                    fileFilter(req, file, cb) {
                        console.log(file)

                        if (!file.mimetype.startsWith('image/')) {
                            
                        cb(new Error('Only images allowed'))
                        return
                    }
                        cb(null, true)
                    },
        }).single('image')
