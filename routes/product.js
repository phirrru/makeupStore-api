const Product = require('../models/Product');
const Cart = require('../models/Cart');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();

//CREATE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    // console.log(user.params.isAdmin);
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//PUT;
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    // const deletedProduct = await Product.findById(req.params.id);
    // console.log(deletedProduct);
    // console.log(await Cart.find({ products: { productId: productId } }));

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json('Product has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Product
router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get('/', async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    // console.log(qCategory);
    // console.log(qCategory.startsWith('search_'));
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      if (qCategory.startsWith('search_')) {
        console.log(typeof qCategory);
        const searchWord = qCategory.slice(7);
        // let searchWordUncut = ''.concat(qCategory);
        console.log(qCategory.slice(7));
        products = await Product.find({
          title: { $regex: new RegExp('.*' + searchWord + '.*', 'i') },
        });
        console.log(products);
      } else {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      }
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
