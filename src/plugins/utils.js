import { JSEncrypt } from 'jsencrypt';
// eslint-disable-next-line no-unused-vars
//import CryptoJS from 'crypto-js';
import {Base64} from "jsencrypt/lib/lib/asn1js/base64";
import md5 from 'js-md5';
import CryptoJS from 'crypto-js';

export function MD5(plainText) {
    return md5(plainText)
}

/**
 * AES加密
 * @param plainText 明文
 * @param tmpKey
 * @param iv
 * @returns {string} base64编码后的密文
 */
export function encryptByAES(plainText, tmpKey,iv=tmpKey) {
    // 判断tmpKey是否为16位
    if (tmpKey.length !== 16) {
        console.error('Key长度不是16位');
        return null;
    }

    // 将字符串转换为字节数组
    const textBytes = CryptoJS.enc.Utf8.parse(plainText);

    // 将密钥转换为字节数组
    const key = CryptoJS.enc.Utf8.parse(tmpKey);

    // 使用AES算法进行加密
    const encrypted = CryptoJS.AES.encrypt(textBytes, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    // 返回加密后的Base64编码字符串
    return encrypted.toString();

}


export function decryptByAES(cipherText, tmpKey, iv=tmpKey) {

    const encryptedData = CryptoJS.enc.Base64.parse(cipherText);
    const decrypted1 = CryptoJS.AES.decrypt({ ciphertext: encryptedData }, CryptoJS.enc.Utf8.parse(tmpKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

// 将解密后的数据从字节数组转换为字符串
    const decryptedText = decrypted1.toString(CryptoJS.enc.Utf8);

    console.log("解密后的数据是：" + decryptedText);

    return decrypted1.toString(CryptoJS.enc.Utf8);
}



// n位随机密钥生成
export function generateKey(keyLength) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let publicKey = '';

    for (let i = 0; i < keyLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        publicKey += characters.charAt(randomIndex);
    }
    return publicKey;
}

// //AES加密
// export function aes128Encrypt(data, key,iv = "qwertyuiasdfghjk") {
//     // eslint-disable-next-line no-undef
//      const data1 = CryptoJS.enc.Utf8.parse(data);
//     // eslint-disable-next-line no-undef
//     const encrypted = CryptoJS.AES.encrypt(data1, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
//     return encrypted.toString();
//
// }
//
// //AES解密
// export function aes128Decrypt(encryptedData, key, iv) {
//     const data1 = CryptoJS.enc.Utf8.parse(encryptedData);
//     // eslint-disable-next-line no-undef
//     const decrypted = CryptoJS.AES.decrypt(data1, key, {  mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
//     return decrypted.toString();
// }
//


export function handleTime(time) {
    time = Math.floor(time);
    let m = Math.floor(time / 60);
    let s = Math.floor(time % 60);
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    return m + ':' + s;
}

// 处理超过n位的字符串
export function handleLongString(str, fs = 10, bs = 10, n = 30) {
    if (str.length < n) {
        return str;
    }
    let front = str.slice(0, fs);
    let behind = str.slice(-bs);
    return front + '...' + behind;
}

// 处理相册时间显示
export function handleAlbumDateShow(date) {
    let myDate = new Date();
    let currentYear = myDate.getFullYear()
    let currentMonth = myDate.getMonth() + 1
    let currentDay = myDate.getDate()

    let arr = date.split('-')
    arr[0] = parseInt(arr[0])
    arr[1] = parseInt(arr[1])
    arr[2] = parseInt(arr[2])

    // 判断是否是今天
    if (arr[0] === currentYear && arr[1] === currentMonth && arr[2] === currentDay) {
        return '今天'
    }

    if (arr[0] === currentYear) {
        return arr[1] + '月' + arr[2] + '日'
    } else {
        return arr[0] + '年' + arr[1] + '月' + arr[2] + '日'
    }
}

// 判断文件类型并返回对应图标img名称
export function getTypeIcon(type) {
    // word
    if (type === "doc" || type === "docx") {
        return 'word'
    }
    // excel
    else if (type === "xlsx" || type === "xls") {
        return 'excel'
    }
    // txt
    else if (type === "txt") {
        return 'txt'
    }
    // pdf
    else if (type === "pdf") {
        return 'pdf'
    }
    // zip
    else if (
        type === "zip" ||
        type === "7z" ||
        type === "rar" ||
        type === "jar"
    ) {
        return 'zip'
    }
    // ppt
    else if (type === "ppt" || type === "pptx") {
        return 'ppt'
    }
    // unknown
    else {
        return 'unknown'
    }
}
export function dataURItoBlob(base64Data) {
    //console.log(base64Data);//data:image/png;base64,
    let byteString;
    if(base64Data.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(base64Data.split(',')[1]);//base64 解码
    else{
        byteString = unescape(base64Data.split(',')[1]);
    }
    let mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];//mime类型 -- image/png

    // var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
    // var ia = new Uint8Array(arrayBuffer);//创建视图
    let ia = new Uint8Array(byteString.length);//创建视图
    for(let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ia], {
        type: mimeString
    });
    return blob;
}
