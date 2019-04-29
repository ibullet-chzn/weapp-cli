import CryptoJS from '../lib/CryptoJS';

const key = CryptoJS.enc.Hex.parse(
  '8e3e16074b3c9833c981f047bf79fb95607d7e624cb03b0a105311a766d46f28',
);
const iv = CryptoJS.enc.Hex.parse('0000000000000000000000000000000000000000000000000000000000000000');

const encrypt = (word) => {
  const src = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(src, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const hexStr = encrypted.ciphertext.toString().toUpperCase();
  const oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
  return CryptoJS.enc.Base64.stringify(oldHexStr);
};

export default encrypt;
