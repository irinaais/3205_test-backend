import {NextFunction, Response} from "express";
import * as core from "express-serve-static-core";

function handleError(err: core.ParamsDictionary, res: Response, next: NextFunction): void {
  console.error(err);
  const statusCode: number = err.statusCode != null ? parseInt(err.statusCode) : 500;
  res.status(statusCode).send({message: statusCode === 500 ? 'Произошла ошибка' : err.message});
  next();
}

module.exports = handleError;
