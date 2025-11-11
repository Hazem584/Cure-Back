const Test = require("../models/test_model");

const get_one_user = (req, res) => {
    const user_id = req.params.id
  res.status(200).json(`get_one_user=${user_id}`);
};

module.exports = { get_one_user };
