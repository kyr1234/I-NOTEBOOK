const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../Models/User')
const { body, validationResult } = require('express-validator')
var jwt = require('jsonwebtoken');
const { fetchuser } = require('../middleware/fetcheruser');

//THE SIGN UP ENDPOINT

router.post(
  '/createuser',
  body('name', 'ENTER A NAME OF ATLEAST SIZE 3').isLength({ min: 3 }),
  body('email', 'ENTER A VALID EMAIL').isEmail(),
  body('password', 'PASSWORD MUST BE OF SIZE 8').isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }

    //CHECKING THE USER ALREADY EXISTS
    try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res.status(400).json({ error: 'THE USER ALREADY EXISTS' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashpass = await bcrypt.hash(req.body.password, salt)

      //Adding data to database
      user = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashpass,
      })
      const data = {
        user: {
          id: user._id,
        },
      }
      //JSON WEB  TOKEN 
      const sec_key = 'letsdoit'
      const auth = jwt.sign(data, sec_key)
      res.json({ auth })
    } catch (error) {
      res.status(500).json({ error })
    }
  },
)

//LOGIN AUTH

router.post(
  '/login',
  body('email', 'ENTER A VALID EMAIL').isEmail(),
  body('password', 'PASSWORD MUST BE PROVIDED').exists(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user) {
        return res.send('LOGIN WITH CORRECT CREDIANTIALS')
      }

      const passwdcmp = await bcrypt.compare(password, user.password)
      if (!passwdcmp) {
        return res.status(403).send('LOGIN WITH CORRECT CREDIANTIALS')
      }
      const sec_keys = 'letsdoit'
      const data = {
        user: {
          id: user.id,
        },
      }
      const authtoken = jwt.sign(data, sec_keys)
      res.json({ authtoken })
    } catch (error) {
      res.status(500).send('SERVER ERROR')
    }
  },
)

router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userid = req.user.id
    const userdata =await User.findById(userid).select('-password')
    res.send(userdata)
  } catch (error) {
    res.status(500).send('SERVER ERROR')
  }
})

module.exports = router
