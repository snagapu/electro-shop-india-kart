
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
    formData.append('orderId', paymentData.orderId);
    formData.append('responseSuccessURL', `${window.location.origin}/order-complete`);
    formData.append('responseFailURL', `${window.location.origin}/payment?status=failed`);
    formData.append('email', paymentData.customerEmail);
    formData.append('billing_name', paymentData.customerName);
    
    // In a real implementation, you would typically:
    // 1. Send this data to your backend
    // 2. Backend would properly sign the request with your credentials
    // 3. Backend would return the URL or form data to submit
    
    // For demo purposes, we'll directly redirect to the test URL
    // WARNING: In production, you should NEVER do this from frontend - always use backend
    const url = 'https://test.ipg-online.com/connect/gateway/processing';
    
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
    form.submit();
    
    // Clean up - remove the form after submission
    setTimeout(() => {
      document.body.removeChild(form);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error initiating hosted checkout:', error);
    return false;
  }
};
