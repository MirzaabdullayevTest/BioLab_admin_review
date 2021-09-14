const {
    body
} = require('express-validator')
const Admin = require('../models/Admin')

exports.registerValidators = [
    body('login').isLength({
        min: 3
    }).withMessage('Логин должно быть минимум 3 символа').custom(async (value, {req})=>{
        try{
            const admin = await Admin.findOne({login: value})
            if(admin){
                return Promise.reject('Такой логин уже занят')
            }
        }catch(err){
            console.log(err);
        }
    }),
    body('name').isLength({
        min: 3
    }).withMessage('Имя должно быть минимум 3 символа'),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({
        min: 6,
        max: 56
    }),
]