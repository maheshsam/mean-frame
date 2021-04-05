import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import { User, Post } from '../../models';
import { successResponse, errorResponse, uniqueId } from '../../helpers';

export const allPosts = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 2;
    const { userId } = req.user;
    const user = await User.scope('withSecretColumns').findOne({
      where: { id: userId },
    });
    if(user.isAdmin){
      const posts = await Post.findAndCountAll({
        order: [['createdAt', 'DESC'], ['title', 'ASC']],
        // offset: (page - 1) * limit,
        // limit,
      });
      return successResponse(req, res, { posts });
    }else{
      const posts = await Post.findAndCountAll({
        where: { id: user.id },
        order: [['createdAt', 'DESC'], ['title', 'ASC']],
        // offset: (page - 1) * limit,
        // limit,
      });
      return successResponse(req, res, { posts });
    }
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const newPost = async (req, res) => {
  try {
    const {
      title, description, 
    } = req.body;

    const { userId } = req.user;
    const user = await User.scope('withSecretColumns').findOne({
      where: { id: userId },
    });


    const newPost = await Post.create({ title: title, description: description, author: user.id });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.postid;
    const post = await Post.findOne({
      where: { id: postId },
    });

    if(post){
      await Post.update({ title: req.body.title, description: req.body.description }, { where: { id: post.id } });
      return successResponse(req, res, 'Post updated Successfully');
    }else{
      throw new Error('Post with given id does not exists!');
    }
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postid;
    const post = await Post.findOne({
      where: { id: postId },
    });
    if(post){
      await Post.destroy({ where: { id: post.id } });
      return successResponse(req, res, 'Post Deleted Successfully');
    }else{
      throw new Error('Post does not exists!');
    }
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const postsByAuthor = async (req, res) => {
  try {
    const authorId = req.params.author;
    
    const author = await User.findOne({ where: { id: authorId } });
    const { userId } = req.user;
    const user = await User.scope('withSecretColumns').findOne({
      where: { id: userId },
    });
    if(author){
      if(user.isAdmin){
        const posts = await Post.findAndCountAll({
          where: { author: author.id },
          order: [['createdAt', 'DESC'], ['title', 'ASC']],
        });
        return successResponse(req, res, { posts });
      }else{
        if(user.id != author.id){
          return errorResponse(req, res, 'You do not have permissions to browser other author posts');
        }else{
          const posts = await Post.findAndCountAll({
            where: { author: author.id },
            order: [['createdAt', 'DESC'], ['title', 'ASC']],
          });
          return successResponse(req, res, { posts });
        }
      }
    }else{
      return errorResponse(req, res, 'Invalid author');
    }
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

