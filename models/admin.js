const brcypt = require("bcryptjs");

// Convert dd/mm/yyyy to yyyy-mm-dd
function convertDateInputFormat(date) {
  let arr = date.split("/");
  return arr[2] + "-" + arr[1] + "-" + arr[0];
}

// Get pool connection
const pool = require("../configs/database");
const dateFormat = require("../utilities/date.format");

module.exports.findAdmin = async email => {
  const data = await pool.query(`SELECT * FROM admin WHERE email = '${email}'`);

  if (data.rows.length == 0) return null;

  data.rows[0].birthday = convertDateInputFormat(
    dateFormat(data.rows[0].birthday, "dd/mm/yyyy")
  );

  return data.rows[0];
};

module.exports.updateProfilePicture = async url => {
  try {
    const result = await pool.query(
      `UPDATE admin SET "profilePicture" = '${url}'`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports.updateProfile = async data => {
  try {
    const result = await pool.query(
      `UPDATE admin SET fullname = '${data.fullname}', birthday = '${data.birthday}', biography = '${data.biography}' WHERE 1 = 1`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
