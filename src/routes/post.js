import express from 'express';
import validate from 'express-validation';

import * as userController from '../controllers/user/user.controller';
import * as postController from '../controllers/post/post.controller';
import * as postValidator from '../controllers/post/post.validator';

const router = express.Router();

//= ===============================
// API routes
//= ===============================
router.get('/list', postController.allPosts);
router.get('/list/author/:author', postController.postsByAuthor);
router.post(
  '/insert',
  validate(postValidator.insert_post),
  postController.newPost,
);
router.post(
  '/update/:postid',
  validate(postValidator.update_post),
  postController.updatePost,
);
router.get('/delete/:postid', postController.deletePost);
module.exports = router;
