const brcypt = require("bcryptjs");

// Get pool connection
const pool = require("../configs/database");

module.exports.findAdmin = async email => {
  const data = await pool.query(`SELECT * FROM admin WHERE email = '${email}'`);

  if (data.rows.length == 0) return null;
  return data.rows[0];
};

// module.exports.createNewUser = async (email, password) => {
//   try {
//     const hashPassword = brcypt.hashSync(password);

//     let timeStamp = new Date();
//     timeStamp = timeStamp.toISOString();

//     let res = await pool.query(
//       `INSERT INTO users (email, password, created_at) VALUES ('${email}', '${hashPassword}', '${timeStamp}')`
//     );

//     // res = await pool.query(
//     //   `INSERT INTO user_info (email, first_name, last_name) VALUES ('${email}','${firstName}','${lastName}')`
//     // );

//     let newUser = await pool.query(
//       `SELECT * FROM users WHERE email = '${email}'`
//     );
//     newUser = newUser.rows[0];

//     // let userInfo = await pool.query(
//     //   `SELECT * FROM user_info WHERE email = '${email}'`
//     // );
//     // userInfo = userInfo.rows[0];

//     // newUser = { ...newUser, ...userInfo };

//     return newUser;
//   } catch {
//     return false;
//   }
// };

// Get products from query object
module.exports.getAllUsers = async queryObj => {
  let query = "SELECT * FROM users WHERE (1 = 1) ORDER BY id ASC";

  let queryCountTotal = "SELECT COUNT(*) FROM users WHERE (1 = 1)";

  // Build paging
  const pageSize = 10;

  if (queryObj.page !== undefined) {
    query += " OFFSET " + (queryObj.page - 1) * pageSize;
  }

  query += " LIMIT " + pageSize;

  console.log(query);

  //
  const countTotal = await pool.query(queryCountTotal);

  let result = {};

  result.totalItems = Number(countTotal.rows[0].count);

  const data = await pool.query(query);

  // standardizedData(data);

  result.data = data.rows;

  return result;
};
// ***

module.exports.getUserDetails = async id => {
  const result = await pool.query(`SELECT * FROM  users WHERE id = ${id}`);
  return result.rows[0];
};

module.exports.changeUserStatus = async id => {
  try {
    let result = await pool.query(`SELECT status FROM  users WHERE id = ${id}`);

    if (result.rows[0].status !== "blocked") {
      result = await pool.query(
        `UPDATE users SET status = 'blocked' WHERE id = ${id}`
      );
    } else {
      result = await pool.query(
        `UPDATE users SET status = NULL WHERE id = ${id}`
      );
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
