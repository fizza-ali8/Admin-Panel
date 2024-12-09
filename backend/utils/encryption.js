const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;
const keyLength = 32;
const iterations = 100000;

const encrypt = (text, secretKey) => {
  const salt = crypto.randomBytes(saltLength);
  const iv = crypto.randomBytes(ivLength);

  const key = crypto.pbkdf2Sync(secretKey, salt, iterations, keyLength, 'sha512');
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
};

const decrypt = (encryptedData, secretKey) => {
  const buffer = Buffer.from(encryptedData, 'base64');

  const salt = buffer.slice(0, saltLength);
  const iv = buffer.slice(saltLength, saltLength + ivLength);
  const tag = buffer.slice(saltLength + ivLength, saltLength + ivLength + tagLength);
  const encrypted = buffer.slice(saltLength + ivLength + tagLength);

  const key = crypto.pbkdf2Sync(secretKey, salt, iterations, keyLength, 'sha512');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted) + decipher.final('utf8');
};

module.exports = {
  encrypt,
  decrypt
}; 