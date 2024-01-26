const mongoose = require('mongoose');

module.exports = async () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        keepAlive: true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log(`🏆 Loaded MONGO database`)
    }).catch((err) =>{
        console.log(err)
    });
}