const express = require('express')
const dotenv = require('dotenv')
const app = express()

const Users = require('./model');

const connectDB = require('./db');
const bodyParser = require('body-parser');
dotenv.config()
connectDB();

app.use(bodyParser.json())

app.get('/', async (req,res) => {
    try{
        const users = await Users.find({isDeleted : false});
        res.json(users);
    }
    catch(err){
        res.json({message : err})
    }
})

app.post('/signup' ,async (req, res) => {
    try {
      const { email, password, username } = req.body;
     
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        if (existingUser.isDeleted) {

            existingUser.password = password
            existingUser.isDeleted = false;
            existingUser.save();
         return res.json({ message: 'Account reactivated successfully.' });
          } else {
            return res.status(409).json({ message: 'User already exists.' });
          }
      }
    const newUser = new Users({ email, password , username });
    await newUser.save();
    res.json({ message : 'User signed in Successfully' });
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


app.post('/login',async(req,res) => {
    
    const {email,password} = req.body
    try{
        const user = await Users.findOne({email});
       if(!user){
        return res.status(401).json({message:'Invalid credentials'})
       }
       if(password !== user.password){
        return res.status(401).json({message:'Invalid credentials'})
       }
       if(user.isDeleted == true){
        res.json({message : "user doesnot exist"})
       }
       res.status(201).json({message:"user created successfully" , user:user});
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
})


app.get('/account/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Users.findById(userId).select('-password -isDeleted');
        res.json(user);
        console.log(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(err);
    }
});

app.put('/account/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, password } = req.body;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.isDeleted == true){
            res.json({message : "User doesnot exist"})
        }
        if (password) {
            user.password = password;
        }
        if (username) {
            user.username = username;
        }
        await user.save();
        res.json({ message: 'Account information updated successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/delete/:id',async (req,res) => {
    try{
        const userId = req.params.id;
        const user = await Users.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isDeleted = true;
        await user.save();
        res.json({message : 'User deleted successfully'})
    }
    catch(err){
        res.status(500).json({message : 'Internal server error'});
    }
})

app.listen(5400,() => console.log('server connected to 5400'));

