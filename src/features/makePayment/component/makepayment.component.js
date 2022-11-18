import React from 'react'
import { Button, View } from 'react-native'
import createStripe from "stripe-client";

const STRIPE_KEY="pk_test_51H1zNdAcnqNndOACFhcAQPnoXAm4WDQNVcy4MxD0XCzDkJhzXAsY94C9VyqjJaiU2WBmkT5OmTRSi4Y8gxNxpKZv00gv44qeft"
const STRIPE_SECRET="sk_test_51H1zNdAcnqNndOACkYpdmJPMOAXz4UhwOJ1q30RXcTqACQSYZMKS0fGD4gs4964oYWg1cq0OdAS5ov4kcMVQHu7O00pOFTnEeQ"
const stripeObject = createStripe(STRIPE_KEY);

import { cardTokenRequest } from '../../../services/stripe/stripe.service';
import axios from 'axios';
import {decode as atob, encode as btoa} from 'base-64'
const FORMURLENCODED = require('form-urlencoded');


async function _parseJSON(token) {
    if (token._bodyInit == null) {
        return token;
    } else {
        const body = await token.json();
        return body;
    }
}

export const MakePayment = ({setLoading, setToken, cardNumber, expiryMonth, expiryYear, cvc, clientName, amount, token, currency}) => {
    const BASE_URL = 'https://api.stripe.com'
    const paymentIntent = () => {
    
        const payment_dets_form = 'amount='+amount+'&currency='+currency+'&payment_method_types[]=card'
    
        fetch(BASE_URL + '/v1/payment_intents', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + STRIPE_SECRET,
            // 'Authorization': 'Basic ' + btoa(STRIPE_SECRET + ':')
        },
        body: payment_dets_form
        }).then(result => {
            console.log("========= Payment Intent Restult =============")
            setLoading(false);
            console.log(_parseJSON(result))
            return result
        }).catch(err => {
            console.log("========= Payment Intent Error =============")
            setLoading(false);
            console.log(err)
            return err
        });
    }

    const paymentCharge = (url) => {
        const charge_params = 'amount='+amount+'&currency='+currency+'&source='+token+'&description=My First Test Charge (created for API docs at https://www.stripe.com/docs/api)'
        fetch(BASE_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(STRIPE_SECRET + ':')
            },
            body: payment_dets_form
            }).then(result => {
                console.log("========= Payment Charge Restult =============")
                setLoading(false);
                console.log(result)
                return result
            }).catch(err => {
                console.log("========= Payment Charge Error =============")
                setLoading(false);
                console.log(err)
                return err
            });
    }


    const onPay = () => {
        setLoading(true)
        const card = {
          number: cardNumber,
          exp_month: expiryMonth,
          exp_year: expiryYear,
          cvc: cvc,
          name: clientName,
        };
        console.log(card)
    
        // creating card token request 
        cardTokenRequest(stripeObject, card)
        .then(result => {
          console.log("========= Printing Result on successful token create =========")
          setToken(result.id)
          paymentIntent()
        })
        .catch(err => {
          console.log("========= Printing Error on token create =========")
          console.log(err)
        });
    
    }
  return (
    <View style={{alignItems: 'center', height: '18%'}}>
        <Button
          style = {{backgroundColor: 'blue'}}
          title="Make Payment"
          onPress={onPay}
        />
      </View>
  )
}
