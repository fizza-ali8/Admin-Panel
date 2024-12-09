const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      attachments
    });
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

const emailTemplates = {
  welcomeEmail: (userName) => ({
    subject: 'Welcome to Our Banking System',
    html: `
      <h1>Welcome ${userName}!</h1>
      <p>Thank you for creating an account with us.</p>
      <p>You can now access all our banking services.</p>
    `
  }),
  
  transactionAlert: (transaction) => ({
    subject: 'Transaction Alert',
    html: `
      <h2>Transaction Notification</h2>
      <p>Amount: ${transaction.amount}</p>
      <p>Type: ${transaction.type}</p>
      <p>Date: ${new Date(transaction.createdAt).toLocaleString()}</p>
    `
  }),

  reportReady: (reportUrl) => ({
    subject: 'Your Report is Ready',
    html: `
      <h2>Report Generated</h2>
      <p>Your requested report has been generated and is ready for download.</p>
      <p><a href="${reportUrl}">Download Report</a></p>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
}; 