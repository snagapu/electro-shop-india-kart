
import React from 'react';

// Add TypeScript declaration for the CryptoJS library
declare global {
  interface Window {
    CryptoJS: any;
  }
}

interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  isEmi?: boolean;
  emiTenure?: number;
  isHybridPayment?: boolean;
  upfrontAmount?: number; // For EMI details only, not used in charge total
}

export const initiateHostedCheckout = async (paymentData: PaymentData) => {
  try {
    console.log('Starting checkout process with data:', paymentData);
    
    // Load required libraries dynamically
    await loadScripts([
      "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"
    ]);
    
    // Ensure libraries are loaded
    if (!window.CryptoJS) {
      console.error("Required libraries not loaded");
      return false;
    }
    
    // Create the form element
    const form = document.createElement('form');
    form.id = 'paymentForm';
    form.method = 'POST';
    form.action = 'https://test.ipg-online.com/connect/gateway/processing';
    form.target = '_blank'; // Open in new tab to avoid CORS issues
    
    // Create and append hidden fields
    const addField = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
      console.log(`Added field: ${name}=${value}`);
      return input;
    };
    
    // Add the required fields as specified
    addField('hash_algorithm', 'HMACSHA256');
    addField('checkoutoption', 'combinedpage');
    addField('language', 'en_US');
    
    // Updated store ID
    // addField('storename', '3300000901');
    addField('storename', '8125000000072');
    
    // Transaction details
    const timezone = 'Asia/Kolkata';
    // const timezone = 'Asia/Singapore';
    
    // Format date manually
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const txnDateTime = `${year}:${month}:${day}-${hours}:${minutes}:${seconds}`;
    
    addField('timezone', timezone);
    addField('txndatetime', txnDateTime);
    addField('txntype', 'sale');
    
    // Format amount correctly - Always use the full product amount from OrderSummary
    const formattedAmount = Number(paymentData.amount).toFixed(2);
    addField('chargetotal', formattedAmount);
    
    // Set currency code
    // addField('currency', '356'); // INR currency code
    // addField('currency', '702'); //SGD currency code
    addField('currency', '784'); //AED currency code

    // REMOVED EMI PARAMETERS - This was causing hash calculation errors
    // No longer adding emiFlag, emiScheme, emiTenure, or hybridPayment parameters
    
    // Additional settings
    addField('full_bypass', 'false');
    addField('dccSkipOffer', 'false');
    addField('authenticateTransaction', 'false');
    
    // Set response URLs - using absolute URLs to avoid CORS issues
    const origin = window.location.origin;
    const successUrl = `${origin}/order-complete?status=success&orderId=${paymentData.orderId}`;
    const failUrl = `${origin}/payment?status=failed`;
    
    addField('responseSuccessURL', successUrl);
    addField('responseFailURL', failUrl);
    
    // Customer details
    if (paymentData.customerEmail) {
      addField('email', paymentData.customerEmail);
    }
    
    if (paymentData.customerName) {
      addField('bname', paymentData.customerName);
    }
    
    // Order ID
    addField('oid', paymentData.orderId);
    
    // Updated shared secret
    // const sharedSecret = 'fb9ms8PezB';
    const sharedSecret = 'ncFFc3F\8"Sx';
    
    // Create an array of all parameters to include in hash
    const messageParameters: Record<string, string> = {};
    
    // Get all form inputs
    Array.from(form.elements).forEach((element: any) => {
      if (element.name && element.name !== 'hashExtended' && element.value) {
        messageParameters[element.name] = element.value;
      }
    });
    
    // Sort keys alphabetically
    const sortedKeys = Object.keys(messageParameters).sort();
    const messageSignatureContent = sortedKeys.map(key => messageParameters[key]).join('|');
    
    console.log('Message content for hash:', messageSignatureContent);
    
    // Calculate HMAC
    const messageSignature = window.CryptoJS.HmacSHA256(messageSignatureContent, sharedSecret);
    const messageSignatureBase64 = window.CryptoJS.enc.Base64.stringify(messageSignature);
    
    // Add the hash
    addField('hashExtended', messageSignatureBase64);
    
    console.log('Form prepared with hash:', messageSignatureBase64);
    
    // Remove any existing payment forms
    const existingForm = document.getElementById('paymentForm');
    if (existingForm) {
      existingForm.remove();
    }
    
    // Add form to document body
    document.body.appendChild(form);
    
    // Short delay to ensure the form is in the DOM
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Submit the form
    console.log('Submitting form to payment gateway:', form);
    form.submit();
    
    return true;
  } catch (error) {
    console.error('Error initiating hosted checkout:', error);
    return false;
  }
};

// Helper function to load external scripts
const loadScripts = (urls: string[]): Promise<boolean> => {
  const promises = urls.map(url => {
    return new Promise<boolean>((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.crossOrigin = "anonymous"; // Add crossorigin attribute
      
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      
      document.head.appendChild(script);
    });
  });
  
  return Promise.all(promises)
    .then(() => true)
    .catch(error => {
      console.error('Error loading scripts:', error);
      return false;
    });
};
