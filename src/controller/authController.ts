import { Request, Response } from 'express-serve-static-core';
import { IUser } from '@/types';
import User from '@/models/userModel';
import jwt from 'jsonwebtoken';
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
};
const signRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });
};
interface ICookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
  expires?: Date;
}
interface IUserBody {
  email: string;
  password: string;
}
const createSendToken = (user: IUser, status: number, response: Response) => {
  const accessToken = signToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());

  const setCommonCookieOptions = (options: ICookieOptions) => {
    options.httpOnly = true;
    // add secure option and sameSite option
  };
  const refreshTokenExpire = process.env.REFRESH_TOKEN_EXIPRES as
    | string
    | number;
  const cookieTokenExpire = process.env.COOKIE_EXPIRES_IN as string | number;

  const refreshTokenCookieOptions = {
    expires: new Date(
      Date.now() + (refreshTokenExpire as number) * 24 * 60 * 60 * 1000,
    ),
  };

  const accTokenCookieOption = {
    expires: new Date(
      Date.now() + (cookieTokenExpire as number) * 24 * 60 * 60 * 1000,
    ),
  };

  if (process.env.NODE_ENV === 'production') {
    setCommonCookieOptions(refreshTokenCookieOptions);
    setCommonCookieOptions(accTokenCookieOption);
  }
  // send cookie
  response.cookie('access_token', accessToken);
  response.cookie('refresh_token', refreshToken);
  response.status(status).json({
    status: 'success',
    data: {
      user,
      token: accessToken,
    },
  });
};

export const login = async (req: Request<{}, {}, IUserBody>, res: Response) => {
  const { email, password } = req.body;
  // get user from email
  const user = await User.findOne({ email }).select('+password');
  // check if there user and password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: 'fail',
      message: 'Incorrect email or password',
    });
  }
  user.password = undefined;
  createSendToken(user, 200, res);
};

export const signup = async (req: Request<{}, {}, IUser>, res: Response) => {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide name, email, password and passwordConfirm',
    });
  }
  const user = await User.create({ name, email, password, passwordConfirm });
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
};

export const logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.access_token || !cookies?.refresh_token) {
    return res.sendStatus(204);
  }
  res.cookie('access_token', '', { maxAge: 1 });
  res.cookie('refresh_token', '', { maxAge: 1 });
  res.status(200).json({
    status: 'success',
    message: 'Logout successfully',
  });
};
