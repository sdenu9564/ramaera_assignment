const router = require('express').Router();
const {PrismaClient} = require('@prisma/client');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const auth = require("../middleware/auth");

const prisma = new PrismaClient();
//Get user details
router.get('/users/:id',auth, async (req, res, next) => {
  try {
    const {id} = req.params
    const user = await prisma.User.findUnique({
      where :{
        id:Number(id)
      }
    })
    res.json(user)
  } catch (error) {
    next(error);
  }
});
//Create user
router.post('/users', async (req, res, next) => {
  try {
    const email = req.body.email;
     if(!validator.isEmail(req.body.email)){
      throw new error('email is not valid')
     }
    const user = await prisma.User.create({
      data:req.body
    })
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
    );
    user.token = token;
    res.json({user,message:"save your token oin your local"})
    
  } catch (error) {
    next(error)
  }
});
//Delete user
router.delete('/users/:id',auth, async (req, res, next) => {
  try {
    const {id} = req.params
    const deleteuser = await prisma.User.delete({
      where:{
        id : Number(id)
      }
    })
    res.json({deleteuser,message:"user deteled successfully"})
  } catch (error) {
    next(error);
  }
});
//Update user details
router.patch('/users/:id',auth, async (req, res, next) => {
  try {
    const {id} = req.params
    const user = await prisma.User.update({
      where:{
        id:Number(id)
      },
      data:req.body
    })
    res.json(user)
  } catch (error) {
    next(error)
  }
});

module.exports = router;
