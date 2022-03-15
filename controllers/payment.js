const Model = require('../models/question.js');

const midtransClient = require('midtrans-client');
// Create Core API instance
let core = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'SB-Mid-server-MJdZAnWPudpNbjt3vZQ3KXxQ',
        clientKey : 'SB-Mid-client-SK-7lvlHEvE3a3bK'
    });

    let parameter =  {
        "payment_type": "gopay",
        "transaction_details": {
          "order_id": "order18",
          "gross_amount": 275000
        },
        "item_details": [
          {
            "id": "id1",
            "price": 275000,
            "quantity": 1,
            "name": "Bluedio H+ Turbine Headphone with Bluetooth 4.1 -"
          }
        ],
        "customer_details": {
          "first_name": "Budi",
          "last_name": "Utomo",
          "email": "budi.utomo@midtrans.com",
          "phone": "081223323423"
        },
        "gopay": {
          "enable_callback": true,
          "callback_url": "someapps://callback"
        }
      }

module.exports.readPayment = async (req, res) => {
  res.render('./payment/index')
};

module.exports.postPayment = async (req, res) => {
    // core.charge(parameter)
    // .then((chargeResponse)=>{
    //     console.log('chargeResponse:',JSON.stringify(chargeResponse));
    //     const charge = JSON.stringify(chargeResponse)
    //     console.log(`tes: ${chargeResponse.actions[1].url}`)
    //     res.redirect(chargeResponse.actions[1].url)
    // })
    // .catch((e)=>{
    //     console.log('Error occured:',e.message);
    // });;
    res.send(req.body)
};


