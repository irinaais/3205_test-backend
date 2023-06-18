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

function delay(ms) {
  return new Promise(res => setTimeout(res, ms))
}

async function findUsers(email, number, users) {
  await delay(5000);

  let filteredUsers = users.filter((user) => user.email === email);
  if (number === '' || number == null) {
    return filteredUsers;
  } else {
    filteredUsers = users.filter((user) => user.number === number);
    return filteredUsers;
  }
}

main();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
  const {
    email, number
  } = req.body;

  const filteredUsers = await findUsers(email, number, users);
  res.status(200).send(JSON.stringify(filteredUsers));
});
