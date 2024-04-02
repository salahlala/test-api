import { Types } from 'mongoose';
import { Request } from 'express-serve-static-core';
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface IUserReq extends Request {
  user?: IUser;
}
