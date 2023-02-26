require("dotenv").config();
const fs = require('fs')
const express = require("express");
const morgan = require("morgan");
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const {notFound,commonErrorHandler} = require('./middleware/errorHandler');
const connect = require("./db/connection");
const app = express();
const User = require('./schema/userSchema');
const Quiz = require("./schema/quizSchema");
const { isLogin ,isLogout} = require("./middleware/verifyToken");
app.set('view engine','hbs')
app.use(express.static(`${__dirname}/public`))
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())
app.get('/',isLogout,(req,res)=> {
    // res.send('nice')
    res.render('login')
})

app.get('/assessment',isLogin,async (req,res,next)=> {
    try {
        const user = req.user;
        const findUser = await User.findById(user._id)
        if(findUser.pre_assessment){
            res.render('assessment',{quizTaken:true})
        } else {
            res.render('assessment')
        }
        
    } catch (error) {
            next(error)
    }
})
app.get('/post_assessment',isLogin,async (req,res,next)=> {
    
    try {
        const user = req.user;
        const findUser = await User.findById(user._id)
        if(!findUser.pre_assessment){
            res.render('post-assessment',{preQuiz:true})
        }
        if(findUser.post_assessment){
            res.render('post-assessment',{quizTaken:true})
        } else {
            res.render('post-assessment')
        }
        
    } catch (error) {
            next(error)
    }
})
app.post('/post_assessment/quiz',isLogin,async (req,res,next)=> {
    try {
        const user = req.user;
        const findUser = await User.findById(user._id)
        if(findUser.post_assessment){
            res.status(400).json({message:'quiz already taken'})
        }
        const answer = req.body
        const quiz = await Quiz.find().select('answer id')
        const correct = quiz.filter(elem => answer.find(e => elem.id == e.questionId && elem.answer == e.selectedOption))
        const date = new Date()
        await User.findByIdAndUpdate(user._id,{post_assessment:{
            mark:correct.length,
            time:date
        }})
        console.log('oaky')
        return res.status(200).json({success:true})
    } catch (error) {
        next(error)
    }
})
app.get('/assessment/quiz',isLogin,async (req,res,next)=> {
    try {
        const quiz = await Quiz.find({}).select('-answer')
        return res.status(200).json(quiz)
    } catch (error) {
        next(error)
    }
})

app.post('/assessment/quiz',isLogin,async (req,res,next)=> {
    try {
        const user = req.user;
        const findUser = await User.findById(user._id)
        if(findUser.pre_assessment){
            res.status(400).json({message:'quiz already taken'})
        }
        const answer = req.body
        const quiz = await Quiz.find().select('answer id')
        const correct = quiz.filter(elem => answer.find(e => elem.id == e.questionId && elem.answer == e.selectedOption))
        const date = new Date()
        await User.findByIdAndUpdate(user._id,{pre_assessment:{
            mark:correct.length,
            time:date
        }})
        res.status(200).json({success:true})
    } catch (error) {
        next(error)
    }
})
app.get('/result',isLogin,async (req,res,next)=> {
    try {
        const user = req.user;
        const findUser = await User.findById(user._id)
        const pre_assessment = findUser.pre_assessment?.mark
        const post_assessment = findUser.post_assessment?.mark 
        let score = 0
        if(pre_assessment || post_assessment){
            score = post_assessment - pre_assessment
        }
        res.render('result',{
            pre_assessment:pre_assessment,
            post_assessment:post_assessment,
            score
        });
    } catch (error) {
        next(error)
    }
})
app.post('/login',async (req,res,next)=> {
    try {
        const {username,password} = req.body
        const user = await User.findOne({username})

        if(!user){
            return res.status(400).json({message:'credential missing'})
        }

        if(user.password !== password){
            return res.status(400).json({message:'credential missing'})
        }
        const token = jwt.sign({user},'test',{expiresIn:'3d'})
        res.cookie('test',token).status(200).json({success:true,message:'login successfull'})
    } catch (error) {
        next(error)
    }
})
app.get('/logout',(req,res,next)=> {
    try {
        res.clearCookie('test').redirect('/')
        
    } catch (error) {
        
    }
})
app.use(notFound);
app.use(commonErrorHandler);

connect()
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
