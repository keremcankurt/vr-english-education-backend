const express = require('express')
const auth = require('./auth')
const student = require('./student')
const course = require('./course')

const router = express.Router()

router.use('/auth',auth)
router.use('/student',student)
router.use('/course',course)

module.exports = router