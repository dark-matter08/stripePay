import React, {useState} from 'react';
import {Button, View} from 'react-native';
import createStripe from 'stripe-client';

const STRIPE_KEY =
  'pk_test_51H1zNdAcnqNndOACFhcAQPnoXAm4WDQNVcy4MxD0XCzDkJhzXAsY94C9VyqjJaiU2WBmkT5OmTRSi4Y8gxNxpKZv00gv44qeft';
const STRIPE_SECRET =
  'sk_test_51H1zNdAcnqNndOACkYpdmJPMOAXz4UhwOJ1q30RXcTqACQSYZMKS0fGD4gs4964oYWg1cq0OdAS5ov4kcMVQHu7O00pOFTnEeQ';
const stripeObject = createStripe(STRIPE_KEY);

import {cardTokenRequest} from '../../../services/stripe/stripe.service';
import {decode as atob, encode as btoa} from 'base-64';
const FORMURLENCODED = require('form-urlencoded');

const _parseJSON = async result => {
  if (result._bodyInit == null) {
    return result;
  } else {
    const body = await result.json();
    return body;
  }
};

export const MakePayment = ({
  setLoading,
  setToken,
  cardNumber,
  expiryMonth,
  expiryYear,
  cvc,
  clientName,
  amount,
  setError,
  currency,
}) => {
  const BASE_URL = 'https://api.stripe.com';
  const rec_email = 'chelucien08@gmail.com';

  const paymentIntent = (token, cardId) => {
    console.log(
      '====================================================================================',
    );
    console.log(
      '============================== Starting Payment Intent =============================',
    );
    console.log(
      '====================================================================================',
    );

    const payment_dets_form =
      'amount=' +
      amount +
      '&currency=' +
      currency +
      '&payment_method_types[]=card';

    fetch(BASE_URL + '/v1/payment_intents', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + STRIPE_SECRET,
      },
      body: payment_dets_form,
    })
      .then(async result => {
        console.log('========= Payment Intent Restult =============');
        var fin_result = await _parseJSON(result);
        console.log(fin_result);
        customerInitiate(fin_result.charges.url, token, cardId);
        return result;
      })
      .catch(err => {
        console.log('========= Payment Intent Error =============');
        console.log(err);
        return err;
      });
  };

  const customerInitiate = (url, token, cardId) => {
    console.log(
      '====================================================================================',
    );
    console.log(
      '============================ Starting Customer Initiate ============================',
    );
    console.log(
      '====================================================================================',
    );

    fetch(BASE_URL + '/v1/customers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + STRIPE_SECRET,
      },
      body:
        'description=My First Test Customer (created for API docs at https://www.stripe.com/docs/api)&email=' +
        rec_email +
        '&name=' +
        clientName, //+ '&source=' + token + '&payment_method=' + cardId
    })
      .then(async result => {
        console.log('========= customer initiate Restult =============');
        var fin_result = await _parseJSON(result);
        console.log(fin_result);

        paymentCharge(url, fin_result.id, token, cardId);
        return result;
      })
      .catch(err => {
        console.log('========= customer initiate Error =============');
        console.log(err);
        return err;
      });
  };

  const paymentCharge = (url, customer, token, cardId) => {
    console.log(
      '====================================================================================',
    );
    console.log(
      '============================== Starting Payment Charge =============================',
    );
    console.log(
      '====================================================================================',
    );

    const charge_params =
      'amount=' +
      amount +
      '&currency=' +
      currency +
      '&source=' +
      token +
      '&description=My First Test Charge (created for API docs at https://www.stripe.com/docs/api)&receipt_email=' +
      rec_email; //+ '&customer=' + customer
    fetch(BASE_URL + '/v1/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(STRIPE_SECRET + ':'),
      },
      body: charge_params,
    })
      .then(async result => {
        console.log('========= Payment Charge Restult =============');
        setLoading(false);
        var fin_result = await _parseJSON(result);
        console.log(fin_result);
        return result;
      })
      .catch(err => {
        console.log('========= Payment Charge Error =============');
        setLoading(false);
        console.log(err);
        return err;
      });
  };

  const onPay = () => {
    setLoading(true);
    const card = {
      number: cardNumber,
      exp_month: expiryMonth,
      exp_year: expiryYear,
      cvc: cvc,
      name: clientName,
    };

    // creating card token request
    cardTokenRequest(stripeObject, card)
      .then(result => {
        console.log(
          '========= Printing Result on successful token create =========',
        );
        setToken(result.id);
        console.log(result);
        paymentIntent(result.id, result.card.id);
      })
      .catch(err => {
        console.log('========= Printing Error on token create =========');
        console.log(err);
      });
  };
  return (
    <View style={{alignItems: 'center', height: '18%'}}>
      <Button
        style={{backgroundColor: 'blue'}}
        title="Make Payment"
        onPress={onPay}
      />
    </View>
  );
};
