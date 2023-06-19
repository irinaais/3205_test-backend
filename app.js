const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { allUsers } = require('./db.ts');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleError = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;
const app = express();

async function main() {
  await app.listen(PORT);
  console.log(`Server listen on ${PORT}`);
}

function delay(ms) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

async function findUsers(email, number, users) {
  await delay(5000);

  let filteredUsers = users.filter((user) => user.email === email);
  if (number === '' || number == null) {
    return filteredUsers;
  }
  filteredUsers = users.filter((user) => user.number === number);
  return filteredUsers;
}

main();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/', async (req, res, next) => {
  try {
    const {
      email, number,
    } = req.body;
    const filteredUsers = await findUsers(email, number, allUsers);

    res.status(200).send(JSON.stringify(filteredUsers));
  } catch (err) {
    next(err);
  }
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  console.error(err);
  handleError(err, res, next);
});
