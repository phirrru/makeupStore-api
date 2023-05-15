const Cart = require('../models/Cart');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();

//CREATE

router.post('/', async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE PRODUCTS
router.put(
  '/add_product/:id',
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      let cart = await Cart.findOne({ userId: req.params.id });
      let total = cart.total;
      // console.log(cart.total);
      console.log(`${total} ${req.body.quantity} ${req.body.price}`);
      total += req.body.quantity * req.body.price;
      console.log(total);

      const newProduct = {
        productId: req.body.productId,
        quantity: req.body.quantity,
      };

      const result = await Cart.updateOne(
        { userId: req.params.id },
        { $push: { products: newProduct } }
      );

      const result2 = await Cart.updateOne(
        { userId: req.params.id },
        { $set: { total: total } }
      );

      console.log(result2);

      res.status(200).json('');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// DELETE PRODUCT
router.delete(
  '/delete_product/:deleteProductId/:id',
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.id });
      const cartId = cart._id.toString();
      console.log('old products ------------------------');
      console.log(cart.products);
      const newProducts = cart.products.filter(
        obj => obj._id.toString() != req.params.deleteProductId
      );
      console.log('new products ------------------------');
      console.log(newProducts);

      // const result = await collection.updateMany(
      //   { userId: userIdValue },
      //   { $set: { products: newProducts } }
      // );

      const result = await Cart.updateMany(
        { userId: req.params.id },
        {
          $set: {
            products: newProducts,
          },
        }
      );
      console.log(`${result.modifiedCount} документов обновлено`);

      // Cart.findByIdAndUpdate(cartId, {
      //   $set: {
      //     products: newProducts,
      //   },
      // });
      // res.status(200).json('');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json('Cart has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART
router.get('/findCart/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART WITH PRODUCTS
router.get(
  '/findCartProducts/:id',
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.id }).populate([
        {
          path: 'products.productId',
          model: 'Product',
        },
      ]);
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// //GET ALL

router.get('/', verifyToken, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
