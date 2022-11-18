// import axios from 'axios'
export const cardTokenRequest = (stripeObject, card) => stripeObject.createToken({ card });

export const paymentIntent = (amount, currency) => {
    
    const payment_dets_form = 'amount='+amount+'&currency='+currency+'&payment_method_types[]=card'

    fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(STRIPE_SECRET + ':')
    },
    body: payment_dets_form
    }).then(result => {
        console.log("========= Payment Intent Restult =============")
        setLoading(false);
        console.log(result)
        return result
    }).catch(err => {
        console.log("========= Payment Intent Error =============")
        setLoading(false);
        console.log(err)
        return err
    });
}

// export const restPaymentRequest = (stripe_key, amount, currency, token) => {
//     axios.post(
//         'https://api.stripe.com/v1/payment_intents',
//         'amount='+amount+'&currency='+currency+'&payment_method_types[]=card',
//         {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             auth: {
//                 username: stripe_key
//             }
//         }
//     ).then(result => {
//         console.log(result)
//         return result
//     }).catch(err => {
//         console.log(err)
//         return err
//     });


// }