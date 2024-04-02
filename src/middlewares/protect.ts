import User from '@/models/userModel';
import { IUserReq } from '@/types';
import { NextFunction, Response } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

export const protect = async (
  req: IUserReq,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({
      status: 'fail',
      message: 'Please login first',
    });
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
  };
  const user = await User.findById(decode.id as string);
  req.user = user;
  // console.log(user);
  next();
};
