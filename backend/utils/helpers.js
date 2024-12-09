const generateAccountNumber = () => {
  return 'ACC' + Date.now() + Math.random().toString(36).substr(2, 5);
};

const calculateLoanDetails = (principal, rate, term) => {
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                        (Math.pow(1 + monthlyRate, term) - 1);
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    totalPayment: parseFloat(totalPayment.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2))
  };
};

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const validateTransactionAmount = (amount) => {
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid transaction amount');
  }
  return parseFloat(amount.toFixed(2));
};

module.exports = {
  generateAccountNumber,
  calculateLoanDetails,
  formatCurrency,
  validateTransactionAmount
}; 