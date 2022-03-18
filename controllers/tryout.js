const User = require('../models/user.js');
const Question = require('../models/question.js');
const Tryout = require('../models/tryout.js');
const Order = require('../models/order.js');

module.exports.index = async (req, res) => {
    const tryouts = await Tryout.find({});
    res.render('./tryout/index', {tryouts});
};

module.exports.readTryout = async (req, res) => {
    const {tryoutId} = req.params;
    const user = await User.findById(req.user._id).populate('result');
    const tryouts = await Tryout.findById(tryoutId).populate('question');
    // console.log(tryoutId)
    // console.log(tryouts)
    if( !tryouts ) {
        req.flash('error', 'tryout tidak ditemukan')  
        return res.redirect('/tryout')
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
    for (const question of tryout.question) {
        await Question.findByIdAndDelete(question._id)
    }
    await Tryout.findByIdAndDelete(tryoutId)
    res.redirect('/tryout')
}

// payment:

const midtransClient = require('midtrans-client');
const tryout = require('../models/tryout.js');
const user = require('../models/user.js');
// Create Core API instance
let core = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'SB-Mid-server-MJdZAnWPudpNbjt3vZQ3KXxQ',
        clientKey : 'SB-Mid-client-SK-7lvlHEvE3a3bK'
    });

module.exports.createPaymentPage = async (req, res) => {
    const {tryoutId} = req.params
    const tryouts = await Tryout.findById(tryoutId)
    res.render('./payment/index', {tryouts})
};

module.exports.createPayment = async (req, res) => {
    const order = await Order.findOne()
    const lastOrder = order.order
    const length = lastOrder.length
    let serialNum = lastOrder[length - 1] + 1
    order.order.push(serialNum)
    order.save()
    // const order = new Order({order : 1});
    // await order.save();
    const {tryoutId} = req.params
    const user = req.user
    const tryouts = await Tryout.findById(tryoutId)
    const parameter = {
        "payment_type": "gopay",
        "transaction_details": {
            "order_id": `order${serialNum}`,
            "gross_amount": tryouts.price
        },
        "item_details": [
          {
            "id": "id1",
            "price": tryouts.price,
            "quantity": 1,
            "name": `${tryouts.title}`
          }
        ],
        "customer_details": {
            "first_name": `${user.username}`,
            "last_name" : ``,
            "email": `${user.email}`,
        },
        "gopay": {
            "enable_callback": true,
            "callback_url": `http://192.168.68.112:3000/tryout/6207d639437b3e8dee5a8498/payment/order${serialNum}`
        }
      }
      
    core.charge(parameter)
    .then((chargeResponse)=>{
        console.log('chargeResponse:',JSON.stringify(chargeResponse));
        const charge = JSON.stringify(chargeResponse)
        console.log(`tes: ${chargeResponse.actions[1].url}`)
        console.log(parameter)
        res.redirect(chargeResponse.actions[1].url)
    })
    .catch((e)=>{
        console.log('Error occured:',e.message);
    });;
};

module.exports.confirmPayment = async (req, res) => {
    const {orderId, tryoutId} = req.params
    const user = req.user
    const tryouts = await Tryout.findById(tryoutId)
    core.transaction.status(`${orderId}`)
    .then((response)=>{
        // udah ada if pasti ditungguin user savenya
        if(response.transaction_status === 'settlement') {
            user.tryout.push(tryouts)
            user.save()
        }
        res.redirect(`/tryout/${tryouts._id}`)
    });

}