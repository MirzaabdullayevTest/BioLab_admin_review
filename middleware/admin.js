const Admin = require('../models/Admin')

module.exports = async function(req, res, next) {
  if (!req.session.admin) {
    return next()
  }

  req.admin = await Admin.findById(req.session.admin._id)
  next()
}