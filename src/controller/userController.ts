import { Request, Response } from 'express-serve-static-core';
import User from '@/models/userModel';
import { IUserReq } from '@/types';
// import { Error } from 'mongoose';
export const getAllUser = async (req: IUserReq, res: Response) => {
  const users = await User.find();
  console.log(req.user);
  res.status(200).json({
    status: 'success',
    data: {
      length: users.length,
      users,
    },
  });
};

export const getUser = async (req: Request<{ id: string }>, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      status: 'success',
      message: 'no user found with that id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

interface IUserBody {
  name: string;
  email: string;
}
interface IUserParams {
  id: string;
}
export const updateUser = async (
  req: Request<IUserParams, {}, IUserBody>,
  res: Response,
) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
    if (!user) {
      throw new Error('No user found with that id ');
    }
    console.log(user);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'there error',
    });
  }
};

export const deleteUser = async (req: Request<IUserParams>, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new Error('No user found with that id');
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'there an error',
    });
  }
};
