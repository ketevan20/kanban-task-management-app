const { isValidObjectId } = require("mongoose")

const validateObjectId = (...paramNames) => (req, res, next) => {
  for (const param of paramNames) {
    if (!isValidObjectId(req.params[param])) {
      return res.status(400).json({ message: `invalid id: ${param}` })
    }
  }
  next()
}

module.exports = validateObjectId