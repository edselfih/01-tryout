const User = require('../models/user.js');
const Question = require('../models/question.js');
const Tryout = require('../models/tryout.js');
const Order = require('../models/order.js');
const midtransClient = require('midtrans-client');
const { urlencoded } = require('express');
const tryout = require('../models/tryout.js');

    // Create Snap API instance
let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : 'SB-Mid-server-MJdZAnWPudpNbjt3vZQ3KXxQ',
        clientKey : 'SB-Mid-client-SK-7lvlHEvE3a3bK'
    });

module.exports.index = async (req, res) => {
    const tryouts = await Tryout.find({});
    res.render('./tryout/index', {tryouts});
};

module.exports.readTryout = async (req, res) => {
    const {tryoutId} = req.params;
    const user = await User.findById(req.user._id).populate('result').populate({
        path: 'order', 
        options: { sort : { '_id' : 1 }}
    });
    console.log(user)
    const tryouts = await Tryout.findById(tryoutId).populate({
        path: 'section',
        populate: {
            path: 'question',
            options: { sort: { 'number': 1 } }
        }
    });
    let pendingOrder = ''
    if (user.order) {
        for (const order of user.order) {
            console.log(tryoutId)
            if(order.tryout.equals(tryoutId)) {
                pendingOrder = `order-${order.orderNum}`
                console.log(`ini pending order dr dalam: ${pendingOrder}`)
            }
        }
    }
    console.log(`ini pending order ${pendingOrder}`)
    if( !tryouts ) {
        req.flash('error', 'tryout tidak ditemukan')  
        return res.redirect('/tryout')
    }
    if (pendingOrder !== '') {
        snap.transaction.status(pendingOrder)
        .then((response)=>{
            console.log(response)
            // udah ada if pasti ditungguin user savenya
            if(response.transaction_status === 'settlement') {
                user.tryout.push(tryouts)
                user.save()
            }
            res.redirect(`/tryout/${tryouts._id}`)
        })
        .catch((e) => {
            e
        })
        
    }
    res.render('./tryout/read', {tryouts, user});
};

module.exports.createTryoutPage = async (req, res) => {
    res.render('./tryout/create');
};

module.exports.createTryout = async (req, res) => {
    const tryouts = new Tryout(req.body.tryout);
    await tryouts.save();
    res.redirect(`/tryout/${tryouts._id}`);
};

module.exports.updateTryoutPage = async (req, res) => {
    const {tryoutId} = req.params;
    console.log(tryoutId)
    const tryouts = await Tryout.findById(tryoutId);
    res.render(`./tryout/update`, {tryouts});
};

module.exports.updateTryout = async (req, res) => {
    const { title, description} = req.body.tryout
    const {tryoutId} = req.params
    const tryouts = await Tryout.findByIdAndUpdate( tryoutId ,{title, description}, {runValidators: true, new: true});
    res.redirect(`/tryout/${tryouts._id}`);
};

module.exports.deleteTryout = async (req, res) => {
    const {tryoutId} = req.params
    const tryout = await Tryout.findById(tryoutId)
    if(tryout.section) {
        for (const section of tryout.section) {
            await Section.findByIdAndDelete(question._id)
        }
    }
    await Tryout.findByIdAndDelete(tryoutId)
    res.redirect('/tryout')
}

// payment:

module.exports.createToken = async (req, res) => {
    const user = req.user
    const {tryoutId} = req.params
    const tryouts = await Tryout.findById(tryoutId)
    const order = await Order.findOne().sort({orderNum : -1})
    let serialNum = 0
    if(!order) {
        serialNum = 1
        const newOrder = new Order({orderNum: 1, tryout: tryoutId})
        await newOrder.save()
    } else {
        serialNum = order.orderNum + 1
        console.log(serialNum)
        const newOrder = new Order({orderNum : serialNum, tryout: tryouts._id})
        await newOrder.save()
        user.order.push(newOrder)
        await user.save()
    }
    const parameter = {
        "transaction_details": {
          "order_id": `order-${serialNum}`,
          "gross_amount": tryouts.price
        },
        "item_details": [
          {
            "id": `${tryouts._id}`,
            "price": tryouts.price,
            "quantity": 1,
            "name": `${tryouts.title}`
          }
        ],
        "customer_details": {
          "first_name": `${user.username}`,
          "last_name": "",
          "email": `${user.email}`
        },
        "callbacks": {
            "finish": "https://limitless-spire-56174.herokuapp.com/tryout/payment/finish"
        }
    }

    snap.createTransaction(parameter)
    .then((transaction)=>{
        // transaction token
        const transactionToken = transaction.token;
        console.log('transactionToken:',transactionToken);
        res.redirect(`/tryout/${tryoutId}/payment/${transactionToken}`)
    })
};

module.exports.createPayment = async (req, res) => {
    const {tokenId, tryoutId} = req.params
    const tryouts = await Tryout.findById(tryoutId)
    res.render(`./payment/index`, {tokenId, tryouts})
};

module.exports.finishPay = async (req, res) => {
    const {order_id, transaction_status} = req.query
    console.log(req.query)
    const user = req.user
    const order = await Order.findOne({orderId: order_id})
    const tryouts = await Tryout.findById(order.tryout)
    if (transaction_status === 'settlement') {
        user.tryout.push(tryouts)
        user.save()
    }
    res.redirect(`/tryout/${tryouts._id}`)
}