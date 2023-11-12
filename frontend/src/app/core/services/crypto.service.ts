import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from '@environment/environment';

const ENCRYPT_SECRET_KEY = environment.encryptedKey;

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  encryptValue(value: string): string {
    const ciphertext: any = CryptoJS.AES.encrypt(value, ENCRYPT_SECRET_KEY);
    return ciphertext.toString();
  }

  decryptValue(encryptedString: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedString, ENCRYPT_SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
}
