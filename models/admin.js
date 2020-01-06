const brcypt = require("bcryptjs");

// Get pool connection
const pool = require("../configs/database");

module.exports.findAdmin = async email => {
  const data = await pool.query(`SELECT * FROM admin WHERE email = '${email}'`);

  if (data.rows.length == 0) return null;
  return data.rows[0];
};
