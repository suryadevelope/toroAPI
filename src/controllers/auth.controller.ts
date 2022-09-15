import { NextFunction, Request, Response } from 'express';
import userModel from '@models/users.model'
import { SHA1 } from "crypto-js"
import checksecurity from '../securitychecks/check.security';



class AuthController {
  public security = new checksecurity();

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      var token = SHA1("\nmail:" + req.body.mail + "\n").toString();
      req.body.uid = token

      var checks = this.security.check(req.body.temptkn);

      if (checks.code == 200) {
        userModel.findOne({ uid: req.body.uid }).then((ress) => {
          if (ress) {
            res.status(401).json({ "Reason": "User with this mail already exists" })
          } else {
            delete req.body.temptkn;
            req.body.password = SHA1(req.body.password).toString();
            userModel.create(req.body).then((response) => {
              res.status(200).json({ "token": response.uid })
            }).catch((e) => {
              res.status(401).json(e)
            })
          }
        }).catch((err) => {
          res.status(401).json(err)
        })
      } else {
        res.status(401).json({ "Access": "denied", "Reason": checks.error })
      }


    } catch (error) {
      res.status(401).json({ "error": error })
    }
  };






  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.headers);
      var checks = this.security.check(req.body.temptkn);
      console.log(checks);
      if (checks.code == 200) {
        userModel.findOne({ mail: req.body.mail }).then((ress) => {
          if(ress.password == SHA1(req.body.password).toString()){
            if (ress) {
              res.status(200).json({ "token": ress.uid })
            } else {
              res.status(404).json({ "err": "user doesnot exists" })
  
            }
          }else{
            res.status(400).json({ "err": "Invalid password" })

          }
          

        }).catch((err) => {
          res.status(401).json(err)

        })
      } else {
        res.status(401).json({ "code": 401, "Reason": checks.error })

      }



    } catch (error) {
      res.status(404).json({ "Reason": error })
    }
  };


}

export default AuthController;
