const express = require('express');
const adminRouter = require('./routers/adminRouter');
const { connect } = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routers/userRouter');

dotenv.config();
const app = express();

app.use(express.json());

app.use('/admin', adminRouter);
app.use('/user', userRouter);

connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Connected to databse');
    app.listen(2002, () => {
      console.log('Listining on port 2002');
    });
  }
);
