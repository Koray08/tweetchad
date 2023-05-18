import { writable } from "svelte/store";
import CryptoJS from "crypto-js";
const secretKey = "superSecretPog";
const storageKey = "user";

const encryptedValue = localStorage.getItem(storageKey);
const decryptedValue = encryptedValue
  ? CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(CryptoJS.enc.Utf8)
  : null;
const initialValue = decryptedValue
  ? JSON.parse(decryptedValue)
  : {
      id: null,
      username: null,
      email: null,
    };

export const user = writable(initialValue);

export const updateUser = (userId, username, email) => {
  const updatedUser = { id: userId, username, email };
  user.set(updatedUser);
  const encryptedValue = CryptoJS.AES.encrypt(
    JSON.stringify(updatedUser),
    secretKey
  ).toString();
  localStorage.setItem(storageKey, encryptedValue);
};
