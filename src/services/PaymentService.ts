
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
    const formattedAmount = Math.round(paymentData.amount * 100).toString();
    
    console.log('Starting checkout process with data:', paymentData);
    
    // Create form data to post to Fiserv
    const formData = new FormData();
    formData.append('txntype', 'sale');
    formData.append('timezone', 'IST');
    formData.append('txndatetime', new Date().toISOString());
    formData.append('hash_algorithm', 'SHA256');
    formData.append('hash', 'demo-only-hash'); // In production, this would be a proper hash
    formData.append('storename', 'demo-store'); // Replace with actual store credentials
    formData.append('mode', 'payonly');
    formData.append('chargetotal', formattedAmount);
    formData.append('currency', paymentData.currency);
    formData.append('oid', paymentData.orderId);
    
    // Ensure these URLs are properly formatted with the full origin
    const successUrl = `${window.location.origin}?status=success`;
    const failUrl = `${window.location.origin}?status=failed`;
    
    formData.append('responseSuccessURL', successUrl);
    formData.append('responseFailURL', failUrl);
    formData.append('email', paymentData.customerEmail);
    formData.append('bname', paymentData.customerName);
    
    // For demo purposes, we'll directly redirect to the test URL
    const url = 'https://test.ipg-online.com/connect/gateway/processing';
    
    console.log('Initiating hosted checkout with data:', {
      amount: formattedAmount,
      orderId: paymentData.orderId,
      customerEmail: paymentData.customerEmail,
      url: url,
      successUrl: successUrl,
      failUrl: failUrl
    });
    
    // Create a form element to submit the data
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = '_self';
    
    // Append form data as hidden fields
    for (const [key, value] of formData.entries()) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = value as string;
      form.appendChild(hiddenField);
    }
    
    // Add form to the document and submit it
    document.body.appendChild(form);
    console.log('Submitting form to Fiserv');
    
    // Force the form to be submitted synchronously to avoid any timing issues
    setTimeout(() => {
      form.submit();
      console.log('Form submitted');
    }, 100);
    
    // Clean up - remove the form after submission
    setTimeout(() => {
      if (document.body.contains(form)) {
        document.body.removeChild(form);
        console.log('Form removed from document');
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error initiating hosted checkout:', error);
    return false;
  }
};
