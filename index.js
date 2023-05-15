const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const catRoute = require('./routes/cat');

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('db is connected'))
  .catch(err => console.log(err));

app.use(express.json());

const cors = require('cors');
app.use(
  cors({
    origin: '*',
  })
);

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/cat', catRoute);

app.listen(process.env.port || 5500, () => {
  console.log('server is running');
});
