import { database } from "./database.js";
import express from 'express';
import logger from 'morgan'

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger('dev'));
app.use('/', express.static('client'));
  

/***************************** user CRD routes *************************/

app.post('/createUser', async (req, res) => {
    const { userName, password } = req.body;
    const result = await database.createUser(userName, password);
    if (result.success) {
    res.status(200).send(result);
    } else {
    res.status(400).send(result);
    }
    res.end();
});
  

app.get('/readUser', async (req, res) => {
    const userName = req.query.userName; // Retrieve the userName from the query parameter
    const result = await database.readUser(userName);
    if (result.success) {
      res.status(200).send(result);
    } else {
      res.status(400).send(result);
    }
    res.end();
});

app.delete('/deleteUser',async(req,res)=>{
    const userName = req.query.userName;
    const result = await database.deleteUser(userName);
    if(result.success) {
        res.status(200).send(result);
    } else {
        res.status(400).send(result);
    }
    res.end();
})


/***************************** picture CRD routes *************************/

app.post('/createPicture', async(req,res) =>{
    const picture = req.body;
    const result = await database.createPicture(picture.ownerName,picture.imgBase,picture.tags,picture.description,picture.exif);
    if(result.success) {
        res.status(200).send(result);
    } else {
        res.status(400).send(result);
    }
    res.end();
})

app.get('/readPicture', async (req, res) => {
    const picId = req.query.picId; // Retrieve the picid from the query parameter
    const picture = await database.readPicture(picId);
    if (picture.success) {
    res.status(200).send(picture);
    } else {
    res.status(400).send(picture);
    }
    res.end();
});

app.delete('/deletePicture', async (req, res) => {
    const picId = req.query.picId;
    const result = await database.deletePicture(picId);
    if(result.success) {
        res.status(200).send(result);
    } else {
        res.status(400).send(result);
    }
    res.end();
});

/***************************** update routes *************************/

app.post('/changeLikeBy', async(req,res) => {
    const pic = req.body;
    const result = await database.changeLikeBy(pic.picId,pic.change);
    if(result.success) {
        res.status(200).send(result);
    } else {
        res.status(400).send(result);
    }
    res.end();
});

app.post('/addComment', async(req,res) =>{
    const comment = req.body;
    await database.addComment(comment.picid,comment.comment,comment.userName);
    res.status(200).send({'status':'success'});
})

app.post('/updateSettings',async(req,res) =>{
    const user = req.body;
    await database.updateSetting(user.userName,user.setting);
    res.status(200).send({'status':'success'});
})

app.post('/updateDescription',async(req,res) =>{
    const user = req.body;
    await database.updateDescription(user.userName,user.description);
    res.status(200).send({'status':'success'});
})

app.post('/updateProfilePicture',async(req,res) =>{
    const user = req.body;
    await database.updateProfilePicture(user.userName, user.profilePic);
    res.status(200).send({'status':'success'});
})

/***************************** query routes *************************/

app.get('/getMostLikedPic', async(req,res)=>{
    const user = req.body;
    const pic = await database.getMostLikedPic(user.userName);
    res.status(200).send(pic);
})

app.get('/getTenMostCommonTags', async(req,res) =>{
    const tags = await database.getTenMostCommonTags();
    res.status(200).send(tags);
});

// app.post('/test',async (req,res)=>{
//     console.log('TEST FOR ROUTE WORKED')
// })

// Handle not routed paths
app.all('*', async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => {
    const msg = `Server started on http://localhost:${port}`;
    console.log(msg);
});
  