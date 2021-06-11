const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    time: Date,
    coinsAdded: Number,
    coinsUsed: Number,
    updatedCoinsBalance: Number,
    creditsPurchased: Number,
    updatedCreditsBalance: Number
},
{
    timestamps: true
  });

const Transactions = mongoose.model('Transactions', transactionSchema);

module.exports = Transactions;