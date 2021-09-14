const {
    Router
} = require('express')
const router = Router()
const Admin = require('../models/Admin')
const bcrypt = require('bcryptjs')
const {
    validationResult
} = require('express-validator')
const {
    registerValidators
} = require('../utils/validators')
const fileMiddleware = require('../middleware/file')

// GO to login page
router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError')
    })
})

// OUT to login page
router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
})

// Login to admin panel
router.post('/login', async (req, res) => {
    try {
        const {
            login,
            password
        } = req.body
        const candidate = await Admin.findOne({
            login
        })

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if (areSame) {
                req.session.admin = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    } else {
                        res.redirect('/admin')
                    }
                })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.redirect('/auth/login')
        }
    } catch (err) {
        throw err
    }
})

// GO to register page
router.get('/register', async (req, res) => {
    res.render('auth/register', {
        title: 'Авторизация',
        isRegister: true,
        registerError: req.flash('registerError')
    })
})

// REGISTER admin
router.post('/register', fileMiddleware.single('avatar'), registerValidators, async (req, res) => {
    try {
        const {
            name,
            login,
            password,
        } = req.body

        req.file ? avatar = req.file.filename : avatar = ''
        const error = validationResult(req)
        if (!error.isEmpty()) {
            req.flash('registerError', error.array()[0].msg)
            return res.status(422).redirect('/auth/register')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const admin = new Admin({
            name,
            login,
            password: hashPassword,
            avatar
        })

        await admin.save()

        res.redirect('/auth/login')
        res.json({
            admin
        })

    } catch (e) {
        console.log(e);
    }
})

module.exports = router