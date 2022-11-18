import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import createStripe from "stripe-client";
import { MakePayment } from './src/features/makePayment/component/makepayment.component';
import { cardTokenRequest } from './src/services/stripe/stripe.service';
// import Stripe from 'stripe';
// var stripe = require(Stripe)

const STRIPE_KEY="pk_test_51H1zNdAcnqNndOACFhcAQPnoXAm4WDQNVcy4MxD0XCzDkJhzXAsY94C9VyqjJaiU2WBmkT5OmTRSi4Y8gxNxpKZv00gv44qeft"
const STRIPE_SECRET="sk_test_51H1zNdAcnqNndOACkYpdmJPMOAXz4UhwOJ1q30RXcTqACQSYZMKS0fGD4gs4964oYWg1cq0OdAS5ov4kcMVQHu7O00pOFTnEeQ"
const stripeObject = createStripe(STRIPE_KEY);
// const stripe = createStripe(STRIPE_SECRET);
// const stripe = new Stripe(STRIPE_SECRET);

// import axios from 'axios';



const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [cardNumber, setCardNumber] = useState('4242424242424242')
  const [expiryMonth, setExpiryMonth] = useState('11')
  const [expiryYear, setExpiryYear] = useState('2027')
  const [cvc, setCvc] = useState('225')
  const [clientName, setClientName] = useState('Nde Lucien')
  const [amount, setAmount] = useState(1000)
  const [currency, setCurrency] = useState('usd')
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)


  

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View style={{alignItems: 'center'}}>
        <Text style={{fontWeight: 'bold', fontSize: 25}}>Test Stripe Details</Text>
      </View>
      <View style={{paddingTop: 20, paddingHorizontal: 40, height: '80%', justifyContent: 'center', fontSize: 20}}>
        <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 10}}>Name: {clientName}</Text>
        <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 10}} >Card Number: {cardNumber}</Text>
        <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 10}}>Card Expiry Date: {expiryMonth}/{expiryYear}</Text>
        <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 10}} >Card CVC: {cvc}</Text>
        <Text style={{fontSize: 17, fontWeight: 'bold', marginTop: 10}} >Charge Amount: {currency} {amount}</Text>

        <View style={{alignItems: 'center', marginTop: 25}}>
          <Text>========= Results ==========</Text>
          {token && (<Text>Token: {token}</Text>)}


          <View style={{alignItems: 'center', marginTop: 25}}>
            {loading && <ActivityIndicator />}
          </View>
          
        </View>
      </View>



      <MakePayment 
        setLoading={setLoading} 
        setToken = {setToken}
        cardNumber = {cardNumber}
        expiryMonth = {expiryMonth}
        expiryYear = {expiryYear}
        clientName  = {clientName}
        cvc = {cvc}
        amount = {amount}
        token = {token}
        currency = {currency}
      />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
