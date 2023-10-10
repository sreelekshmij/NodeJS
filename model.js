const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email : {type : 'String' , required : true, unique : true},
    password : {type:'String', required : true},
    username : {type:'String' , required : true},
    isDeleted:{type:'Boolean', default: false}
})

module.exports = mongoose.model('userDetails',userSchema);