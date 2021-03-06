// mongodb connector
const mongoose = require('mongoose');
const config = require('config');

// get db url from config
mongoose.connect(config.get('db'), {useNewUrlParser:true})
        .then(function(){
            console.log('Connected to MongoDB...');
        })
        .catch(function(err){
            console.log('Could not connect to MongoDB...', err);
        });
module.exports = mongoose;