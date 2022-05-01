import express from 'express'
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51K6D6ISBDSlDpcqyrvoQOb0IfZcAgjQC0Vadlv4b6use1Srj2uHWSMovPOyU9dlg48CwY2WsUj0Y0SzzlQVLHK2R00S3SO7FFo');
import shortid from 'shortid';
const router = express.Router();



router.post('/', async (req,res)=>{
    const {token,order} = req.body;
    const indempotencyKey = shortid.generate();
    try{

    const customer = await stripe.customers.create({
        email: token.email,
        source: token.id
    })
    const {shippingAddress, totalPrice, user} = order;
    console.log(customer)
    const newOrder  = await stripe.charges.create({
        amount : totalPrice*100,
        currency: 'INR',
        customer: customer.id,
        receipt_email: token.email,
        shipping:{
            name: user.name,
            address:{
                city: shippingAddress.city,
                country:shippingAddress.country,
                postal_code: shippingAddress.postalCode
            }
        }
    }
    ,
        {
            idempotency_key: indempotencyKey
        }
     );
    console.log(newOrder);

    res.status(200).json(newOrder);

    }catch(err){
        console.log(err.message);
        res.status(500).json({error: "server error, payment failed"});
    }


})
export default router;