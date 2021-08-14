const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/parser',
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
    .then(()=>{
        console.log('Connect to localhost')
    })
    .catch(err => {
        console.log(err)
    })