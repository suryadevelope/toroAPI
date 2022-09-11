import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import userModel from '@models/users.model'
import {SHA1} from "crypto-js"



class AuthController {
  public authService = new AuthService();

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      var token =  SHA1("\nmail:"+req.body.mail+"\n").toString();
      req.body.uid = token

      userModel.findOne({ uid: req.body.uid }).then((ress) => {
        if (ress) {          
            res.status(401).json({"Reason":"User with this mail already exists"})
          
        } else {
          userModel.create(req.body).then((response) => {
            res.status(200).json({"token":response.uid})
          }).catch((e) => {
            res.status(401).json(e)
          })
        }
  
      }).catch((err) => {
        res.status(401).json(err)

      })




    } catch (error) {
      next(error);
    }
  };






  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
    
      userModel.findOne({ mail: req.body.mail}).then((ress) => {
        
        if (ress) {
             res.status(200).json({"token":ress.uid})
          } else {
          res.status(404).json({"err":"user doesnot exists"})
            
          }
    
        }).catch((err) => {
          res.status(401).json(err)

        })
    
    
      


    } catch (error) {
      res.status(404).json({"Reason":error})
    }
  };


}

export default AuthController;
