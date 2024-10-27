import CryptoJS from "crypto-js";

export function ArrayBufferToWordArray (arrayBuffer) {
    const u8 = new Uint8Array(arrayBuffer, 0, arrayBuffer.byteLength);
    const len = u8.length;
    const words = [];
    for (let i = 0; i < len; i += 1) {
        words[i >>> 2] |= (u8[i] & 0xff) << (24 - (i % 4) * 8);
    }
    return CryptoJS.lib.WordArray.create(words, len);
}

export function WordArrayToArrayBuffer (wordArray) {
    const { words } = wordArray;
    const { sigBytes } = wordArray;
    const u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i += 1) {
        const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        u8[i] = byte;
    }
    return u8;
}

export function AESEncData (data, key, iv) { // 这里的data是WordBuffer类型的数据
    const bKey = CryptoJS.enc.Hex.parse(key);
    // const bKey = CryptoJS.enc.Utf8.parse(key);
    const bIv = CryptoJS.enc.Hex.parse(iv);
    // const bIv = CryptoJS.enc.Utf8.parse(iv);

    const encrypt = CryptoJS.AES.encrypt(data, bKey, { iv: bIv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const arrayBuffer = WordArrayToArrayBuffer(encrypt.ciphertext);
    return arrayBuffer;
}

export function AESDecData(data, key, iv) { // 这里的data是WordBuffer类型的数据
    const bKey = CryptoJS.enc.Hex.parse(key);
    // const bKey = CryptoJS.enc.Utf8.parse(key);
    const bIv = CryptoJS.enc.Hex.parse(iv);
    // const bIv = CryptoJS.enc.Utf8.parse(iv);
    const decrypt = CryptoJS.AES.decrypt({ ciphertext: data }, bKey, { iv: bIv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const arrayBuffer = WordArrayToArrayBuffer(decrypt);
    return arrayBuffer;
}
