import CryptoJS from '../lib/CryptoJS';

const key = CryptoJS.enc.Hex.parse(
  '123-test',
);
const iv = CryptoJS.enc.Hex.parse('0');

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
