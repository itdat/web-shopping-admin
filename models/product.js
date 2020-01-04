// Get pool connection
const pool = require("../configs/database");
const dateFormat = require("../utilities/date.format");
const validator = require("validator");

// Convert data type "number" in PostgreSQL to number in Javascript
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

// Convert dd/mm/yyyy to yyyy-mm-dd
function convertDateInputFormat(date) {
  let arr = date.split("/");
  return arr[2] + "-" + arr[1] + "-" + arr[0];
}

// Standardized data got from database
function standardizedData(products) {
  // Old price
  products.rows.map(product => {
    product.price = formatNumber(
      Number(product.price.replace(/[^0-9.-]+/g, ""))
    );
  });

  // New price
  products.rows.map(product => {
    let newPrice = Math.ceil(
      Number(product.price.replace(/[^0-9]+/g, "")) *
        (1 - product.promote / 100)
    );

    console.log(newPrice);

    newPrice =
      Math.floor(newPrice / 1000) * 1000 + (newPrice % 1000 >= 500) * 1000;

    console.log(newPrice);

    product.newPrice = formatNumber(Math.floor(newPrice));
  });

  // Images
  products.rows.map(product => {
    product.images = product.images.split("|");
  });

  // New status
  products.rows.map(product => {
    let dateRelease = new Date(product.dateRelease.toString());
    let currentDate = new Date();
    let distance = Math.round(
      (currentDate - dateRelease) / (1000 * 60 * 60 * 24)
    );
    if (distance > 0 && distance <= 15) {
      product.new = "new";
    }
  });

  // Date release
  products.rows.map(product => {
    product.dateRelease = dateFormat(product.dateRelease, "dd/mm/yyyy");
  });

  products.rows.map(product => {
    product.dateReleaseInput = convertDateInputFormat(product.dateRelease);
  });
}

// Middleware to check if ID of update operation is valid
module.exports.isValidID = async (req, res, next) => {
  const data = await pool.query("SELECT COUNT(*) FROM products");
  const maxID = data.rows[0].count;

  const updateID = Number(req.params.id);

  if (updateID >= 1 && updateID <= maxID) {
    next();
  } else {
    res.sendStatus(400); // bad request
  }
};

// Function check if input data are valid
isValidData = data => {
  // Check if compulsory inputs are empty
  if (validator.isEmpty(data.name, { ignore_whitespace: true })) return false;
  if (validator.isEmpty(data.brand, { ignore_whitespace: true })) return false;
  if (validator.isEmpty(data.price, { ignore_whitespace: true })) return false;
  if (validator.isEmpty(data.quantity, { ignore_whitespace: true }))
    return false;
  if (validator.isEmpty(data.dateRelease, { ignore_whitespace: true }))
    return false;
  if (validator.isEmpty(data.path, { ignore_whitespace: true })) return false;

  // Check if 'price' is valid currency
  if (
    !validator.isCurrency(data.price, {
      thousands_separator: "."
    })
  )
    return false;

  // Check if 'promote' and 'quantity' are valid number
  if (!validator.isDecimal(data.quantity, { decimal_digits: "0" }))
    return false;
  if (
    data.promote !== "" &&
    !validator.isDecimal(data.promote, { decimal_digits: "0" })
  )
    return false;

  // Check if 'dateRelease' is valid date
  if (!validator.isISO8601(data.dateRelease)) return false;

  return true;
};

standardizedInputData = data => {
  // Remove extra space from 'name', 'brand' and 'description'
  data.name = data.name.replace(/\s+/g, " ");
  data.brand = data.brand.replace(/\s+/g, " ");
  data.description = data.description.replace(/\s+/g, " ");

  data.price = Number(data.price.replace(/[^0-9]/g, ""));
  data.promote = Number(data.promote);
  data.quantity = Number(data.quantity);

  data.images = [data.img1, data.img2, data.img3, data.img4].join("|");
  delete data.img1;
  delete data.img2;
  delete data.img3;
  delete data.img4;
};

// Get products from query object
module.exports.getProductsByQueryObject = async queryObj => {
  const filteringParams = ["brand", "price"];

  // Initialize default query string
  let query =
    'SELECT id, name, brand, price, promote, quantity, "dateRelease", rating, path, images FROM products WHERE (1 = 1)';

  let queryCountTotal = "SELECT COUNT(*) FROM products WHERE (1 = 1)";

  // Loop to build filtering condition
  filteringParams.forEach(paramKey => {
    if (queryObj[paramKey] !== undefined) {
      let paramValues = [].concat(queryObj[paramKey]);

      let paramQuery = "(1 = 0)";

      paramValues.forEach(paramValue => {
        paramQuery += " OR ";
        if (paramKey === "price") paramQuery += priceQueryMap[paramValue];
        else paramQuery += `(${paramKey} = '${paramValue}')`;
      });

      query += ` AND (${paramQuery})`;
      queryCountTotal += ` AND (${paramQuery})`;
    }
  });

  // Build ordering option
  if (queryObj.sort !== undefined) {
    query += " ORDER BY " + sortQueryMap[queryObj.sort];
  } else {
    query += " ORDER BY id ASC";
  }

  // Build paging
  const pageSize = 10;

  if (queryObj.page !== undefined) {
    query += " OFFSET " + (queryObj.page - 1) * pageSize;
  }

  query += " LIMIT " + pageSize;

  //
  const countTotal = await pool.query(queryCountTotal);

  let result = {};

  result.totalItems = Number(countTotal.rows[0].count);

  const data = await pool.query(query);
  standardizedData(data);

  result.data = data.rows;

  return result;
};
// ***

module.exports.getProductDetails = async path => {
  const data = await pool.query(
    "SELECT * FROM products WHERE path = '" + path + "'"
  );
  const countPaid = await pool.query(
    `SELECT sum(quantity) FROM receipt_details WHERE id_product = ${data.rows[0].id}`
  );
  data.rows[0].countPaid = Number(countPaid.rows[0].sum);
  standardizedData(data);
  return data.rows[0];
};

module.exports.updateProductDetails = async (id, data) => {
  if (isValidData(data)) {
    standardizedInputData(data);
    console.log(data);

    // Build query string from data
    let query = "UPDATE products SET";
    Object.keys(data).forEach((key, index) => {
      if (index != 0) {
        query += ",";
      }
      query += ` "${key}" = '${data[key]}'`;
    });
    query += `WHERE "id" = ${id}`;

    try {
      const result = await pool.query(query);
      console.log("UPDATED!!!");
      return true;
    } catch (error) {
      console.log("UPDATE FAILED!!!");
      console.log(error);
      return false;
    }
  } else {
    console.log("UPDATE FAILED!!!\nInvalid data");
    return false;
  }
};

module.exports.getProductsByBrand = async brand => {
  const data = await pool.query(
    `SELECT id, name, brand, price, promote, path, rating, "dateRelease" FROM products WHERE brand = '${brand}'`
  );
  standardizedData(data);
  return data.rows;
};
// ***

module.exports.countProductsByBrand = async brand => {
  const data = await pool.query(
    `SELECT COUNT(*) FROM products WHERE brand = '${brand}'`
  );
  return data.rows[0].count;
};
