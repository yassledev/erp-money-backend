const { validationResult, body } = require('express-validator');

export const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

export async function validate_transaction(req, res, next){
  validate([
    body('user_id').notEmpty().withMessage("User ID is missing."),
    body('products').isArray().notEmpty(),
    body('products.*.id').notEmpty().withMessage("ID of one product is missing."),
    body('products.*.quantity').notEmpty().withMessage("quantity of one product is missing."),
    body('type').notEmpty(),
    body('amount').notEmpty().isNumeric()
  ])
  next()
}