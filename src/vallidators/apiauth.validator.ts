import { NextFunction, Response, Request } from 'express';
import Joi from 'joi';


const signupjoy = Joi.object({
    name: Joi.string().empty().trim().required(),
    mail: Joi.string().empty().trim().required(),
    mobile: Joi.string().empty().trim().required(),
    affliate: Joi.boolean().empty(),
    password: Joi.string()
});

const loginjoy = Joi.object({
    mail: Joi.string().empty().trim().required(),
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
