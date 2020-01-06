const express = require('express');
const checkAuth = require('../middleware/check-auth');
const extractImage = require('../middleware/multer');
const postController = require(`../controllers/postController`)

const router = express.Router();




// creating a post
router.post(
  "/",
  checkAuth,
  extractImage,
  postController.createPost)

// fetch all posts
router.get('/', postController.getPosts)

// get single post
router.get('/:id', postController.getPost)

// update a post
router.put(
  '/:id',
  checkAuth,
  extractImage,
  postController.updatePost)

// delete a post
router.delete('/:id', checkAuth,
  postController.deletePost)

// Like A Post
router.post(
  "/like/:id",
  checkAuth,
  postController.likePost)

module.exports = router;
