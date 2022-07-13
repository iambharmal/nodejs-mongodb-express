import User from './../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  Request,
  Response
} from "express";
dotenv.config();

const jwtSecret: string = process.env.JWT_SECRET || 'commonsecretkey';

export default class AuthController {

  public async register(req: Request, res: Response) {
    const { name, email, phone, password: plainTextPass, designation } = req.body;
    
    // validations
    if(!name || typeof name !== 'string')
      res.status(409).json({status: 'error', error: 'Name is required.'})
    if(!email || typeof email !== 'string')
      res.status(409).json({status: 'error', error: 'Email is required.'})
    if(!phone || typeof phone !== 'string')
      res.status(409).json({status: 'error', error: 'Phone is required.'})
    if(!plainTextPass || typeof plainTextPass !== 'string')
      res.status(409).json({status: 'error', error: 'Password is required.'})
  
    const password = await bcrypt.hash(plainTextPass,10);
    try {
      const user = await User.create({
        name,
        email,
        phone,
        password,
        designation
      });
  
      res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: user
      });
    } catch (error: any) {
      // console.log(error)
      if(error.code === 11000) {
        // duplicate email 
        if(error.keyPattern.hasOwnProperty('email')) {
          res.status(409).json({
            status: 'error',
            error: 'Email already in use'
          })
        }
  
        if(error.keyPattern.hasOwnProperty('phone')) {
          res.status(409).json({
            status: 'error',
            error: 'Phone number already in use'
          })
        }
      }
      throw error;
    }
  }
  
  public async login(req: Request, res: Response) {
    const { email, password: encryptedPass } = req.body;
    
    // validations
    if(!email || typeof email !== 'string')
      res.status(409).json({status: 'error', error: 'Email is required.'})
    if(!encryptedPass || typeof encryptedPass !== 'string')
      res.status(409).json({status: 'error', error: 'Password is required.'})
  
    try {
      const user: any = await User.findOne({ email }).lean();
      if(!user)
        res.status(201).json({
          status: 'error',
          message: 'User not found!'
        });
  
      if( await bcrypt.compare(encryptedPass,user.password) ) {
        const token = jwt.sign(
          {
            id: user._id,
            username: user.email
          },
          jwtSecret
        )
        user.token = token;
        res.status(200).json({
          status: 'success',
          message: 'User logged in successfully',
          data: user
        });
      } else {
        res.status(401).json({
          status: 'error',
          message: 'Password incorrect',
          data: user
        });
      }
    } catch (error) {
      // console.log(error)
      throw error;
    }
  }

}