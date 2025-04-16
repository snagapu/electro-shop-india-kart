
// EMI calculation utilities

/**
 * Calculate EMI (Equated Monthly Installment)
 * Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where P = Principal, r = monthly interest rate, n = tenure in months
 */
export const calculateEMI = (
  principal: number,
  interestRate: number,
  tenure: number
): number => {
  // Convert annual interest rate to monthly rate
  const monthlyRate = interestRate / 12 / 100;
  
  // Calculate EMI using the formula
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
  
  return Math.round(emi * 100) / 100;
};

/**
 * Calculate total payment amount over the entire tenure
 */
export const calculateTotalPayment = (
  emi: number,
  tenure: number
): number => {
  return Math.round(emi * tenure * 100) / 100;
};

/**
 * Calculate total interest amount
 */
export const calculateTotalInterest = (
  principal: number,
  totalPayment: number
): number => {
  return Math.round((totalPayment - principal) * 100) / 100;
};

/**
 * Get EMI options for different tenures
 */
export interface EMIOption {
  tenure: number;
  interestRate: number;
  monthlyAmount: number;
  totalAmount: number;
  totalInterest: number;
  cashbackAmount?: number;
}

export const getEMIOptions = (
  principal: number
): EMIOption[] => {
  // Define available EMI tenures and their annual interest rates
  const options = [
    { tenure: 3, interestRate: 12, cashbackAmount: 0 },
    { tenure: 6, interestRate: 14, cashbackAmount: 0 },
    { tenure: 9, interestRate: 15, cashbackAmount: 1000 },
    { tenure: 12, interestRate: 16, cashbackAmount: 2500 }
  ];
  
  return options.map(option => {
    const monthlyAmount = calculateEMI(
      principal,
      option.interestRate,
      option.tenure
    );
    
    const totalAmount = calculateTotalPayment(monthlyAmount, option.tenure);
    const totalInterest = calculateTotalInterest(principal, totalAmount);
    
    return {
      tenure: option.tenure,
      interestRate: option.interestRate,
      monthlyAmount,
      totalAmount,
      totalInterest,
      cashbackAmount: option.cashbackAmount
    };
  });
};

/**
 * Calculate the updated principal after upfront payment
 */
export const calculateRemainingPrincipal = (
  totalAmount: number,
  upfrontAmount: number
): number => {
  return Math.max(0, totalAmount - upfrontAmount);
};

/**
 * Format price in Indian Rupees
 */
export const formatIndianRupees = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
