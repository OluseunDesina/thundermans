
// import express from 'express';
// import logger from 'morgan';
// import bodyParser from 'body-parser';
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const Post = require("./models/postModel")

const app = express();

mongoose.connect("mongodb+srv://seun:u176CB7h4waFJqmV@cluster0-cwm4l.mongodb.net/better-guy?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(`connected to DB`)
})
.catch((err) => {
  console.log(`error connecting to Database`);
  console.log(err);
})


const corOptions = {
  "origin": "*",
  "credentials": "true",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

app.use(cors(corOptions));

app.use(logger('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  console.log(post);
  res.status(201).json({
    message: "better guy, added your post",
    post: post
  })
})

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      "userId": 1,
      "id": 1,
      "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      "content": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    },
    {
      "userId": 1,
      "id": 2,
      "title": "qui est esse",
      "content": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
    },
    {
      "userId": 1,
      "id": 3,
      "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
      "content": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
    },
    {
      "userId": 1,
      "id": 4,
      "title": "eum et est occaecati",
      "content": "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit"
    },
    {
      "userId": 1,
      "id": 5,
      "title": "nesciunt quas odio",
      "content": "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
    },
  ];
  res.status(200).json({
    message: `How far better guy, your post fetched successfully`,
    posts: posts
  })
})

module.exports = app;
