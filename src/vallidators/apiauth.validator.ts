import { NextFunction, Response, Request } from 'express';
import Joi from 'joi';


const signupjoy = Joi.object({
    name: Joi.string().empty().trim().required(),
    mail: Joi.string().empty().trim().required(),
    mobile: Joi.string().empty().trim().required(),
    affliate: Joi.string().empty().required(),
    password: Joi.string().empty().required(),
    temptkn: Joi.string().empty().required()
});

const loginjoy = Joi.object({
    mail: Joi.string().empty().trim().required(),
    temptkn: Joi.string().empty().required()
});




export const AuthValidateMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    var schema: Joi.AnySchema;
    var path = req.route.path;
    var method = req.method;

    if (method === 'POST' && path === '/signup') {
        schema = signupjoy;
    }else if(method === 'POST' && path === '/login'){
        schema = loginjoy;
    }

    schema
        .validateAsync(req.body)
        .then(() => {
            next();
        })
        .catch(err => {
            res.status(400).json({ statusCode: 400, message: err });
        });
};
