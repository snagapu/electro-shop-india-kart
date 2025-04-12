
export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};

export const formatExpiryDate = (value: string): string => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  
  if (v.length > 2) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  }
  
  return v;
};

export const generateOrderId = (): string => {
  return "ORD" + Math.floor(100000 + Math.random() * 900000);
};

export const calculateOrderTotals = (totalPrice: number) => {
  const taxRate = 0.18;
  const taxes = totalPrice * taxRate;
  const shippingThreshold = 5000;
  const shippingCost = totalPrice > shippingThreshold ? 0 : 499;
  const orderTotal = totalPrice + taxes + shippingCost;
  
  return {
    taxes,
    shippingCost,
    orderTotal
  };
};
