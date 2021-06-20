const { genSalt, hash, compare } = require('bcryptjs');
const { Router } = require('express');
const Admin = require('../models/Admin');

const adminRouter = Router();

adminRouter.post('/signup', async (req, res) => {
  const userInfo = req.body;
  if (!userInfo.password)
    return res.status(400).json({ err: 'Missing password field' });
  const salt = await genSalt(10);
  const passwordHash = await hash(userInfo.password, salt);
  const user = await Admin.create({
    ...userInfo,
    password: passwordHash,
  }).catch((err) => res.status(400).json({ err: err }));
  res.status(200).json(user);
});

adminRouter.post('/login', async (req, res) => {
  const userInfo = req.body;
  if (!userInfo.password || !userInfo.email)
    return res.status(400).json({ err: 'Missing required field' });
  const user = await Admin.findOne({
    email: userInfo.email,
  }).catch((err) => res.status(500).json({ err }));
  if (!user) return res.status(400).json({ err: 'User does not exist' });
  const match = await compare(userInfo.password, user.password);
  if (!match) return res.status(400).json({ err: 'Invalid password' });
  res.send({ msg: 'Logged in' });
});

module.exports = adminRouter;
