import {User, usersDb} from "./db";
import express, {ErrorRequestHandler, Express, NextFunction, Request, Response} from 'express';

const cors = require('cors');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const handleError = require('./middlewares/handleError.js');
const { limiter } = require('./middlewares/limiter.js');

const { PORT = 3001 } = process.env;
const app: Express = express();

async function main() {
  await app.listen(PORT);
  console.log(`Server listen on ${PORT}`);
}

function delay(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

async function findUsers(email: string, number: string, users: User[]) {
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
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    number: Joi.string().optional().allow(''),
  }),
}), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email, number,
    } = req.body;
    const filteredUsers = await findUsers(email, number, usersDb.allUsers);

    res.status(200).send(JSON.stringify(filteredUsers));
  } catch (err) {
    next(err);
  }
});
app.use(errors());
app.use(errorLogger);

const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  handleError(err, res, next);
}
app.use(errorRequestHandler);
