import Router from "express";

const router = new Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', userController.verification)
