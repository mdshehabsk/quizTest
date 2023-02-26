const jwt = require('jsonwebtoken')
function isLogin (req,res,next){
    try {
        const cookie = req.cookies.test;
        if(!cookie){
           return res.redirect('/')
        }
        jwt.verify(cookie,'test',(err,decode)=> {
            if(err){
                return res.redirect('/')
            }
            req.user = decode.user
            next()
        })
    } catch (error) {
        next(error)
    }
}

const isLogout = (req,res,next) => {
    try{ 
        console.log('route hit')
    const cookie = req.cookies.test;
        if(!cookie){
          return next()
        }
        jwt.verify(cookie,'test',(err,decode)=> {
            if(err){
               return next()
            }
            if(decode){
               return res.redirect('/result')
            }
        })
    } catch (error) {
        next(error)
    }}

module.exports = {isLogin,isLogout}