const Joi = require('joi');
const review = require('./model/review');

const listingSchema = Joi.object({
    list:Joi.object({
        title: Joi.string().required(),
        image:Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country:Joi.string().required()
       
    }).required()
});

const reviewSchema = Joi.object({
    review:Joi.object({
        message: Joi.string().required(),
        rating:Joi.string().required().min(1).max(5)
    }).required()
});

module.exports = { listingSchema , reviewSchema };