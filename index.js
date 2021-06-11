const express = require('express');
const app = express();
const path = require('path');
const User = require('/Users/sgawa/EWallet/models/user');
const bcrypt = require('bcrypt');
const session =  require('express-session');
const Transactions = require('/Users/sgawa/EWallet/models/transactions');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/walletApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("CONNECTION OPEN!!!")
})
.catch(err => {
    console.log("oh no error!!")
    console.log(err)
})

app.use(require("express-session")({
    secret: "ZubeeGoSemesterProject",
    cookie: { 
        httpOnly: true,
        expires : Date.now() + 3600000*24*7,
        maxAge: 3600000*24*7
    },
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('public', path.join(__dirname, '/public'));

app.get('/', (req, res) => {
    res.render('mainpage');
})

app.get('/register', (req, res) => {
    res.render('register');
})
app.post('/register', async (req, res) => {
    const {password, username} = req.body;
    const hashpw = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hashpw
    })
    await user.save();
    req.session.user_id = user._id;

    res.redirect('/home')
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async (req,res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validPw = await bcrypt.compare(password, user.password);
    if (validPw) {
        req.session.user_id = user._id;
        res.redirect('/home')
    } else {
        res.send("TRY AGAIN")
    }
})

const verifyUser = (req, res, next) => {
    let user = User.findById(req.session.user_id );
    if (user = req.session.user_id){
        next();
    } else{
        res.send("not fouund")
    }
       
}

app.get('/home',verifyUser, (req, res) => {
    res.render('home')
})

app.get('/coinsBalance',verifyUser, async (req, res) => {
    User.findById(req.session.user_id ).exec(async (err, foundUser, next) => {
        if(err){
            console.log(err);
        }
        else{
            res.send(`<h1> Coins: ${foundUser.coins} </h1>`);
        }
    })
})

app.get('/creditsBalance',verifyUser, async (req, res) => {
    User.findById(req.session.user_id ).exec(async (err, foundUser, next) => {
        if(err){
            console.log(err);
        }
        else{
           
            res.send(`<h1> Credits: ${foundUser.credits} </h1>`);
        }
    })
})

app.get('/coinsWallet', verifyUser, async (req, res) => {
    res.render('coinsWallet');
})
app.post('/coinsWallet', verifyUser, async (req, res) => {
    User.findById(req.session.user_id ).exec(async (err, foundUser, next) => {
        if(err){
            console.log(err);
        }
        else{
            console.log(foundUser);
            foundUser.coins += parseInt(req.body.coins);
            foundUser.save() 
            console.log(foundUser)
            res.send(`Coins Added to your wallet`);
        }
    })
    
})

app.get('/creditsWallet', verifyUser,  (req, res) => {
    res.render('creditsWallet');
})
app.post('/creditsWallet', verifyUser, async (req, res) => {
    User.findById(req.session.user_id ).exec(async (err, foundUser, next) => {
        if(err){
            console.log(err);
        }
        else{
            const coupon = req.body.coupon;
            var x = 10;
            if (coupon == "Lucky"){
                x = 5;
            }
            console.log(foundUser);
            var coin  = parseInt(foundUser.coins);
            var credit = parseInt(req.body.credits);
            if(coin >= x*credit){
                coin -= x*credit;
                foundUser.coins = coin;
                foundUser.credits += credit;
                foundUser.save() 
            console.log(foundUser)
            res.send(`Credits Added to your wallet`);}
            }
            
            res.send("Insufficient coins ")
        })
})

app.get('/transactions', verifyUser, async (req,res) => {
    User.findById(req.session.user_id ).exec(async (err, foundUser, next) => {
        if(err){
            console.log(err);
        }
        else{
            const transaction = new Transactions({
                time: new Date(),
                coinsAdded: parseInt(foundUser.coins),
                coinsUsed: 10 * parseInt(foundUser.credits)  ,
                // updatedCoinsBalance: `parseInt(foundUser.coins) -${10*foundUser.credits}`,
                creditsPurchased: parseInt(foundUser.credits),
                // updatedCreditsBalance: parseInt(foundUser.credits)
            })
            await transaction.save()
            console.log(transaction);
            res.render('transactions', { transaction });
        }
    })
})

app.get('/logout', verifyUser, (req, res) => {
    res.render('logout')
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/login');
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})