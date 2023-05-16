import { database } from "./database.js";
import express from 'express';
import logger from 'morgan'

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger('dev'));
app.use('/', express.static('client'));

app.get('/getPicture', async(req,res)=>{
    const picid = req.body;
    try{
        const picture = await database.readPicture(picid.picid)
        res.status(200).send(picture);
    }
    catch(err){
        res.status(400);
    }
});

app.post('/createPicture', async(req,res) =>{
    const picture = req.body;
    await database.createPicture(picture.ownerName,picture.imgBase,picture.tags,picture.description,picture.exif);
    res.status(200).send({"status" : "success"});
})

app.post('/createUser', async(req,res) =>{
    const user = req.body;
    await database.createUser(user.userName,user.password);
    res.status(200).send({'status':'success'});
})

app.delete('/deletePicture', async(req,res)=>{
    const pic = req.body;
    await database.deletePicture(pic.picid);
    res.status(200).send({'status':'success'});
})

app.delete('/deleteUser',async(req,res)=>{
    const user = req.body;
    await database.deleteUser(user.userName);
    res.status(200).send({'status':'successs'});
})

app.get('/getMostLikedPic', async(req,res)=>{
    const user = req.body;
    const pic = await database.getMostLikedPic(user.userName);
    res.status(200).send(pic);
})

app.post('/addComment', async(req,res) =>{
    const comment = req.body;
    await database.addComment(comment.picid,comment.comment,comment.userName);
    res.status(200).send({'status':'success'});
})

app.post('/changeLikeBy', async(req,res) => {
    const pic = req.body;
    await database.cahngeLikeBy(pic.picid,pic.change);
    res.status(200).send({'status':'success'});
});

app.get('/getTenMostCommonTags', async(req,res) =>{
    const tags = await database.getTenMostCommonTags();
    res.status(200).send(tags);
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

// app.post('/test',async (req,res)=>{
//     console.log('TEST FOR ROUTE WORKED')
// })

app.all('*', async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
  });

  app.listen(port, () => {
  
    const msg = `Server started on http://localhost:${port}`;
    console.log(msg);
  });
  