const Joi = require('joi');
const review = require('./model/review');

const imageSchema = Joi.alternatives().try(
    Joi.string(),
    Joi.object({
        url: Joi.string().required(),
        filename: Joi.string().optional(),
    })
);

const listingFieldsSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
});

const listingSchema = Joi.object({
    list: listingFieldsSchema.keys({
        image: imageSchema.required(),
    }).required(),
});

// For updates, image can be omitted (keep existing image).
const listingUpdateSchema = Joi.object({
    list: listingFieldsSchema.keys({
        image: imageSchema.optional(),
    }).required(),
});

const reviewSchema = Joi.object({
    review:Joi.object({
        message: Joi.string().required(),
        rating: Joi.number().integer().min(1).max(5).required()
    }).required()
});

module.exports = { listingSchema, listingUpdateSchema, reviewSchema };
