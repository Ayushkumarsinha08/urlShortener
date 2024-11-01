const express=require('express');
const shortid=require('shortid');
const mongoose=require('mongoose');
const {schema,url, }=require('./model/schema');
const { json } = require('body-parser');
const {handleConnection}=require('./connections/url');


const app=express();
app.use(json());

handleConnection('mongodb://localhost:27017/url-shortener');

app.post('/',async (req,res)=>{
    const shortId=shortid();
    const result=await url.create({
        originalUrl:req.body.url,
        shortID:shortId,
    });

    return res.json(result);
});

app.get('/:id',async (req,res)=>{
    try {
        const foundUrl = await url.findOne({ shortID: req.params.id });

        if (foundUrl) {
            return res.redirect(foundUrl.originalUrl);
        } else {
            return res.status(404).send("Error: URL not found");
        }
    } catch (error) {
        console.error('Error retrieving URL:', error);
        return res.status(500).send("Internal Server Error");
    }
})

app.listen(3000,console.log('server start'));