import { Router, Request, Response } from "express";
import sample_service from "./UploadServices/UploadService";
import { addResponseHeaders } from "../Utils";
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

var cors = require('cors')
const fs = require('fs/promises');
const router = Router();

// Route to this controller: /upload

router.get("/", (req: Request, res: Response, next) => {
    addResponseHeaders(res);
    res.send("tests")
})

// This endpoint is accessed using: <API Url>/upload/sample
router.get("/sample", (req: Request, res: Response, next) => {
    addResponseHeaders(res);
    res.send(sample_service())
})

router.use(cors())

router.post('/uploads', function (req: Request, res: Response) {
    let filePaths : string[] = []

    //set up the storage path and filename
    const storage = multer.diskStorage({
        destination: function (req: Request, file:Express.Multer.File, cb:DestinationCallback) {
            cb(null, __dirname + '/uploads')
        },
        filename: function (req: Request, file:Express.Multer.File, cb: FileNameCallback) {

            //cb(null, Date.now() + '-' +file.originalname )
            let timeStamp = Date.now().toString()
            filePaths.push(timeStamp + ".json")
            console.log(filePaths)
            cb(null, timeStamp + '.json')
        }
    })


    var upload = multer({ storage: storage }).any()

    console.log("post received")

    // upload the file and catch any error.
    upload(req, res, function (err) {
        console.log("entering upload function")
        if (err instanceof multer.MulterError) {
            console.log("multer error on post")
            console.log(err)
            return res.status(500).json(err)
        } else if (err) {
            console.log("non multer error on post")
            console.log(err)
            return res.status(500).json(err)
        }
    })

    // for (var filePath of filePaths) {
    //     let keys : string[] = []
    //     let runOnce = false 
        
    //     readKeysFromPath(filePath).then((results) => {
    //         if (!runOnce) {
    //             keys = results
    //             runOnce = true
    //         } else {           
    //             keys.filter(x => results.includes(x))
    //         }
    //       });
    // }

    //res.append('params', keys)

    // database call sending files
    // delete files here

    //res.append('filepaths', filePaths)

    return res.status(200).send(req.file)
})

// app.get('/uploads/', function (req, res) {
//     const filePath = __dirname + '/uploads/' + timeStamp + '.json'
//     res.sendFile(filePath)
// })

// app.get('/uploads/parameters', function (req, res) {
//     const filePath = __dirname + '/uploads/' + timeStamp + '.json'
//     readKeysFromPath(filePath).then((results) => {
//         res.send(results)
//       });  
// })

async function readKeysFromPath(path: string) {
    try {
        var keys = new Array()
        const data = await fs.readFile(path, { encoding: 'utf8' });
        const json = JSON.parse(data)
        const initialKeys = Object.keys(json['posterior']['content'])
        // check for complex entries and exclude them
        for (var i = 0; i < initialKeys.length; i++) {
            if (!json['posterior']['content'][initialKeys[i]][0]['__complex__']) {
                keys.push(initialKeys[i])
            }
        }
        return (keys)
    } catch (err) {
        console.log(err);
    }
}

export default router;
