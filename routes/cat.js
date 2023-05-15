const Cat = require('../models/Cat');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();

//CREATE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newCat = new Cat(req.body);
  console.log(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

//PUT;
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedCat = await Cat.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Cat.findByIdAndDelete(req.params.id);
    res.status(200).json('Product has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET CAT
router.get('/find/:id', async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);
    res.status(200).json(cat);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL CATS
router.get('/', async (req, res) => {
  //   const qNew = req.query.new;
  //   const qCategory = req.query.category;
  try {
    let cats;
    cats = await Cat.find();

    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
