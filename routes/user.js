const User = require('../models/User');
const Cart = require('../models/Cart');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');

const router = require('express').Router();
//PUT
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    const result = await Cart.deleteOne({ userId: req.params.id });

    console.log(
      `${result.deletedCount} документ удален с userId=${req.params.id}`
    );
    res.status(200).json('User has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.put(
//   '/changeRights/:id',
//   verifyTokenAndAdmin,
//   async (req, res) => {
//     try {

//       const result = await Cart.updateMany(
//         { userId: req.params.id },
//         {
//           $set: {
//             products: newProducts,
//           },
//         }
//       );
//       console.log(`${result.modifiedCount} документов обновлено`);

//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// );

module.exports = router;
