const express = require('express');
const cors = require('cors');
const { users } = require('./db.js');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

async function main() {
  await app.listen(PORT);
  console.log(`Server listen on ${PORT}`);
}

main();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  const {
    email, number
  } = req.body;

  let filteredUsers = users.filter((user) => user.email === email);
  if (number === '' || number == null) {
    res.status(200).send(JSON.stringify(filteredUsers));
  } else {
    filteredUsers = users.filter((user) => user.number === number);
    res.status(200).send(JSON.stringify(filteredUsers));
  }
});
