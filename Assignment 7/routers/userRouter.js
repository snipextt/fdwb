const { Router } = require('express');
const { genSalt, hash, compare } = require('bcryptjs');
const User = require('../models/User');
const Blog = require('../models/Blog');
const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
  const userInfo = req.body;
  if (!userInfo.password)
    return res.status(400).json({ err: 'Missing password field' });
  const salt = await genSalt(10);
  const passwordHash = await hash(userInfo.password, salt);
  const user = await User.create({ ...userInfo, password: passwordHash }).catch(
    (err) => res.status(400).json({ err: err })
  );
  res.status(200).json(user);
});

userRouter.post('/login', async (req, res) => {
  const userInfo = req.body;
  if (!userInfo.password || !userInfo.email)
    return res.status(400).json({ err: 'Missing required field' });
  const user = await User.findOne({
    email: userInfo.email,
  }).catch((err) => res.status(500).json({ err }));
  if (!user) return res.status(400).json({ err: 'User does not exist' });
  const match = await compare(userInfo.password, user.password);
  if (!match) return res.status(400).json({ err: 'Invalid password' });
  res.send({ msg: 'Logged in' });
});

userRouter.get('/getUser/:id', async (req, res) => {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ err: 'missing user id' });
  const user = await User.findById(userId).catch((err) =>
    res.status(500).json({ err })
  );
  if (!user) res.status(404).json({ err: 'User not found' });
  res.status(200).json(user);
});

userRouter.post('/postBlog', async (req, res) => {
  const blogInfo = req.body;
  const blog = await Blog.create({ ...blogInfo }).catch((err) =>
    res.status(400).json({ err: err })
  );
  res.status(200).json(blog);
});

userRouter.get('/getBlog/:id', async (req, res) => {
  const blogId = req.params.id;
  if (!blogId) return res.status(400).json({ err: 'missing blog id' });
  const blog = await Blog.findById(blogId).catch((err) =>
    res.status(500).json({ err })
  );
  if (!blog) res.status(404).json({ err: 'blog not found' });
  res.status(200).json(blog);
});

module.exports = userRouter;
