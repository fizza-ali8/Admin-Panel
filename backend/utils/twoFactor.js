const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const generateTwoFactorSecret = async () => {
  const secret = speakeasy.generateSecret({
    name: process.env.APP_NAME
  });

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    qrCode: qrCodeUrl
  };
};

const verifyTwoFactorToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1 // Allows for 30 seconds of time drift
  });
};

module.exports = {
  generateTwoFactorSecret,
  verifyTwoFactorToken
}; 