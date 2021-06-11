const UserDetails = require('/Users/sgawa/EWallet/models/userDetails');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/walletApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("CONNECTION OPEN!!!")
})
.catch(err => {
    console.log("oh no error!!")
    console.log(err)
})

const coins1 = new UserDetails({
    noOfCoins: 200,
    noOfCredits: 10 
})

coins1.save().then(coins1 => {
    console.log(coins1)
})
.catch(e => {
    console.log(e)
})