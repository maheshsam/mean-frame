const Joi = require('joi');

export const getPostsByAuthor = {
  body: {
    author: Joi.number().required(),
  },
};

export const insert_post = {
  body: {
    title: Joi.string().required(),
    description: Joi.string().required(),
  },
};

export const update_post = {
  body: {
    title: Joi.string().required(),
  },
};