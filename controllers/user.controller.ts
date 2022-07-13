import User from './../models/user';
import {
  Request,
  Response
} from "express";

export default class UserController {

  public async index(req: Request, res: Response) {
    try {
      const users = await User.find().lean();
      return res.status(200).json({
        status: 'success',
        message: 'User listed successfully',
        data: users
      });
    } catch (error) {
      throw error
    }
  }

}