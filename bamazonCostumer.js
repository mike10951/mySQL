var mysql = require("mysql");
var inquirer = require("inquirer");
// Connection object
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "bamazon"
});

// Start connection
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected as id " + connection.threadId);
  readProducts();
});

function selectItem() {
  inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "Enter the ID of the product you would like to buy"
      },
      {
        name: "productQuantity",
        type: "input",
        message: "How many would you like to buy?"
      }
    ])
    .then(function(answer) {
      isAvailable(answer.product, answer.productQuantity);
    });
}

function isAvailable(product, quantity) {
  connection.query(
    "SELECT * FROM products WHERE ?",
    { item_id: product },
    function(err, res) {
      var selectedItem = res[0];
      updateValue(selectedItem, quantity);
    }
  );
}

function updateValue(item, quantity) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      { stock_quantity: item.stock_quantity - quantity },
      { item_id: item.item_id }
    ],
    function(err, res) {
      readProducts();
    }
  );
}

function readProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) console.log(err);
    for (var i in res) {
      console.log(
        `${res[i].item_id} | ${res[i].product_name} | ${res[i].department_name} | $${res[i].price} | ${res[i].stock_quantity}`
      );
    }
    selectItem();
  });
}
