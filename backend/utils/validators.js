const Joi = require('joi');

const schemas = {
  // Auth Validators
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    business_name: Joi.string().required(),
    phone: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Meta Account Validator
  metaAccount: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  // Message Validator
  message: Joi.object({
    conversation_id: Joi.string().uuid().required(),
    message_text: Joi.string().required(),
    attachments: Joi.array().optional()
  }),

  // Quotation Validator
  quotation: Joi.object({
    customer_id: Joi.string().uuid().required(),
    items: Joi.array().items({
      name: Joi.string().required(),
      quantity: Joi.number().required(),
      price: Joi.number().required()
    }).required(),
    notes: Joi.string().optional()
  }),

  // Order Validator
  order: Joi.object({
    customer_id: Joi.string().uuid().required(),
    quotation_id: Joi.string().uuid().optional(),
    items: Joi.array().required(),
    delivery_address: Joi.object().optional()
  })
};

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const messages = error.details.map(detail => detail.message);
    return res.status(400).json({ errors: messages });
  }
  
  req.validated = value;
  next();
};

module.exports = { schemas, validate };
