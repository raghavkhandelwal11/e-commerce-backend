require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const parser = bodyparser.json();

const router = express.Router();

router.use(express.json());

router.post("/checkout", parser, async (req, res) => {
    try{
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            line_items: req.body.items.map((item) => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.product,
                        },
                        unit_amount: item.price
                    },
                    quantity: item.quantity
                }
            }),
            success_url: "https://raghavkhandelwal11.github.io/payment-status/Success.html",
            cancel_url: "https://raghavkhandelwal11.github.io/payment-status/Failed.html"

        });
        console.log("success");
        res.json({url: session.url})
    } catch(e) {
        res.status(500).send("request rejected");
    }
});



module.exports = router;
