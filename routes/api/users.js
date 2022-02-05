const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User } = require('../../db');
const { check, validationResult } = require('express-validator');
const moment = require('moment');
const jwt = require('jwt-simple');

router.post('/register', [
  check('username', 'The username is required').not().isEmpty(),
  check('password', 'The password is required').not().isEmpty(),
  check('email', 'The email is required').isEmail()
], async (req, res) => {
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const user = await User.create(req.body);
  res.json(user);
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({
    where: { email: req.body.email }
  });
  if (user) {
    const equal = bcrypt.compareSync(req.body.password, user.password);
    if (equal) {
      res.json({ success: createToken(user) });
    } else {
      res.json({ error: 'User not found' });
    }
  } else {
    res.json({ error: 'User not found' });
  }
});

const createToken = (user) => {
  const payload = {
    userId: user.id,
    createdAt: moment().unix(),
    expiredAt: moment().add(5, 'minutes').unix()
  };

  return jwt.encode(payload, 'secret');
};

module.exports = router;
