import Joi from 'joi';

const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: true, allowUnknown: false, stripUnknown: true });
  if (error) {
    const msg = error.details && error.details[0] && error.details[0].message ? error.details[0].message.replace(/"/g, '') : 'Invalid input';
    return res.status(400).json({ success: false, error: msg, code: 'INVALID_INPUT' });
  }
  if (source === 'params') req.params = value;
  else req.body = value;
  next();
};

const idSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.length': 'Valid id required',
    'string.hex': 'Valid id required',
    'any.required': 'Valid id required'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({ 'string.email': 'Valid email required', 'any.required': 'Valid email required' }),
  password: Joi.string().required().messages({ 'any.required': 'Password required', 'string.empty': 'Password required' })
});

const vendorCreateSchema = Joi.object({
  name: Joi.string().required().messages({ 'any.required': 'name is required', 'string.empty': 'name is required' })
});

const payoutCreateSchema = Joi.object({
  vendor_id: Joi.string().hex().length(24).required().messages({ 'string.length': 'Valid vendor_id required', 'string.hex': 'Valid vendor_id required', 'any.required': 'Valid vendor_id required' }),
  amount: Joi.number().greater(0).required().messages({ 'number.greater': 'Amount must be > 0', 'any.required': 'Amount must be > 0' }),
  mode: Joi.string().valid('UPI', 'IMPS', 'NEFT').required().messages({ 'any.only': 'Invalid mode', 'any.required': 'Invalid mode' }),
  note: Joi.string().allow('', null)
});

const rejectBodySchema = Joi.object({
  decision_reason: Joi.string().required().messages({ 'any.required': 'decision_reason required', 'string.empty': 'decision_reason required' })
});

export const loginValidators = [validate(loginSchema, 'body')];
export const vendorCreateValidators = [validate(vendorCreateSchema, 'body')];
export const payoutCreateValidators = [validate(payoutCreateSchema, 'body')];
export const payoutIdParam = [validate(idSchema, 'params')];
export const rejectValidators = [validate(idSchema, 'params'), validate(rejectBodySchema, 'body')];
