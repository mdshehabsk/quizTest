
const {Schema, model} = require('mongoose')

const quizSchema = new Schema({
    id:Number,
    question:{
        type:String,
    },
    answer:Number,
    option:[
        {
            value:String,
            id:Number,
            _id:false,
        }
    ],
})

const Quiz = new model('Quiz',quizSchema)

module.exports = Quiz