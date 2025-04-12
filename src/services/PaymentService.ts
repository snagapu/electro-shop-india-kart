
interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
}

export const initiateHostedCheckout = async (paymentData: PaymentData) => {
  try {
    // Format amount as expected by Fiserv (in cents without decimal)
    const formattedAmount = paymentData.amount.toFixed(2);
    
    console.log('Starting checkout process with data:', paymentData);
    
    // Create the form element
    const form = document.createElement('form');
    form.id = 'paymentForm';
    form.method = 'POST';
    form.action = 'https://test.ipg-online.com/connect/gateway/processing';
    
    // Create and append hidden fields
    const addField = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
      return input;
    };
    
    // Add the required fields as specified in the example
    addField('hash_algorithm', 'HMACSHA256');
    addField('checkoutoption', 'combinedpage');
    addField('language', 'en_US');
    
    // Store details
    addField('storename', '80004160'); // Use the store ID from the provided form
    
    // Transaction details
    const timezone = 'Asia/Dubai';
    const now = new Date();
    // Format date as YYYY:MM:DD-HH:mm:ss
    const txnDateTime = now.getFullYear() + ':' +
                         String(now.getMonth() + 1).padStart(2, '0') + ':' +
                         String(now.getDate()).padStart(2, '0') + '-' +
                         String(now.getHours()).padStart(2, '0') + ':' +
                         String(now.getMinutes()).padStart(2, '0') + ':' +
                         String(now.getSeconds()).padStart(2, '0');
    
    addField('timezone', timezone);
    addField('txndatetime', txnDateTime);
    addField('txntype', 'sale');
    addField('chargetotal', formattedAmount);
    
    // Set currency code - 356 for INR (Indian Rupee)
    addField('currency', '356'); // INR currency code
    
    // Additional settings
    addField('full_bypass', 'false');
    addField('dccSkipOffer', 'false');
    addField('authenticateTransaction', 'false');
    
    // Set response URLs
    const successUrl = `${window.location.origin}?status=success`;
    const failUrl = `${window.location.origin}?status=failed`;
    
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
    
    // Calculate hash
    // Note: In a production environment, you would calculate this hash on the server side
    // This is a simplified version for demo purposes - in production, use a server endpoint
    const sharedSecret = 'sharedsecret'; // This should be kept secure - ideally on server side
    
    // Create an array of all parameters to include in hash
    const messageParameters: Record<string, string> = {
      txndatetime: txnDateTime,
      timezone: timezone,
      storename: '80004160',
      chargetotal: formattedAmount,
      currency: '356',
      txntype: 'sale',
      full_bypass: 'false',
      dccSkipOffer: 'false',
      authenticateTransaction: 'false',
      responseSuccessURL: successUrl,
      responseFailURL: failUrl,
      oid: paymentData.orderId
    };
    
    if (paymentData.customerEmail) {
      messageParameters.email = paymentData.customerEmail;
    }
    
    if (paymentData.customerName) {
      messageParameters.bname = paymentData.customerName;
    }
    
    // Sort keys alphabetically
    const sortedKeys = Object.keys(messageParameters).sort();
    const messageSignatureContent = sortedKeys.map(key => messageParameters[key]).join('|');
    
    // For demo purposes, using a placeholder hash
    // In production, this should be properly calculated on server-side
    addField('hashExtended', 'demoHashValue'); // In production, calculate this on the server
    
    console.log('Preparing form with parameters:', messageParameters);
    console.log('Redirect URLs - Success:', successUrl, 'Fail:', failUrl);
    
    // Add form to document body
    document.body.appendChild(form);
    
    // Logging
    console.log('Form ready for submission');
    
    // Submit the form
    form.submit();
    console.log('Form submitted to Fiserv gateway');
    
    return true;
  } catch (error) {
    console.error('Error initiating hosted checkout:', error);
    return false;
  }
};
