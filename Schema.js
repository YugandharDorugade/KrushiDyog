const Joi = require('joi');

const listingSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'Title should be a string',
    'any.required': 'Title is required'
  }),
  description: Joi.string().required().messages({
    'string.base': 'Description should be a string',
    'any.required': 'Description is required'
  }),
  weight: Joi.number().required().messages({
    'number.base': 'Weight should be a number',
    'any.required': 'Weight is required'
  }),
  price: Joi.number().required().messages({
    'number.base': 'Price should be a number',
    'any.required': 'Price is required'
  }),
  images: Joi.array().items(Joi.object({
    url: Joi.string().uri().required().messages({
      'string.uri': 'Each image URL should be a valid URI',
      'any.required': 'Image URL is required'
    }),
    filename: Joi.string().required().messages({
      'string.base': 'Filename should be a string',
      'any.required': 'Filename is required'
    })
  })).default([]).messages({
    'array.base': 'Images should be an array of objects'
  }),
  origin: Joi.string().required().messages({
    'string.base': 'Origin should be a string',
    'any.required': 'Origin is required'
  }),
  reviews: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Each review ID should be a valid ObjectId'
  })).messages({
    'array.base': 'Reviews should be an array of ObjectIds'
  }),
  owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Owner ID should be a valid ObjectId',
    'any.required': 'Owner is required'
  })
});

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating should be a number',
    'number.integer': 'Rating should be an integer',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating can be at most 5',
    'any.required': 'Rating is required'
  }),
  comment: Joi.string().required().messages({
    'string.base': 'Comment should be a string',
    'any.required': 'Comment is required'
  }),
  author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Author ID should be a valid ObjectId',
    'any.required': 'Author is required'
  })
});

module.exports = { listingSchema, reviewSchema };
