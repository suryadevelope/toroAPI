import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import { AuthValidateMiddleWare } from '@/vallidators/apiauth.validator';

class AuthRoute implements Routes {
  public pathlogin = '/login';
  public pathsignup = '/signup';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.pathlogin}`,AuthValidateMiddleWare, this.authController.logIn);
    this.router.post(`${this.pathsignup}`, AuthValidateMiddleWare, this.authController.signup);
  }
}

export default AuthRoute;
