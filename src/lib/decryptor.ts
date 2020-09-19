const crypto = require('crypto');
const iconv = require("iconv-lite");
const forge = require('node-forge');

type OctetString = {
    offset: number,
    headerSize: number,
    length: number
}

const OctetIV: OctetString = {
    offset: 56,
    headerSize: 2,
    length: 8
};

const OctetSalt: OctetString = {
    offset: 66,
    headerSize: 2,
    length: 16
};

const OctetCipherText: OctetString = {
    offset: 84,
    headerSize: 4,
    length: -1
};

export class Decryptor {
    private static hashSaltPassword = (salt: Buffer, key: Buffer): Buffer => {
        const hash = crypto.createHash('SHA1');
        hash.update(key);
        hash.update(salt);

        return hash.digest().slice(0, 16);
    }

    private static getValue = (buffer: Buffer, octet: OctetString): Buffer => {
        const sourceStart = octet.offset + octet.headerSize;
        const sourceEnd = (octet.length > 0) ? sourceStart + octet.length : buffer.length;
        const bufferSize = sourceEnd - sourceStart;
        const result = Buffer.alloc(bufferSize);
        buffer.copy(result, 0, sourceStart, sourceEnd);
        return result;
    }

    public static decrypt = (encodedData: string, key: string): string => {
        // https://github.com/enghqii/PayPaperDecrypter
        const buffer = Buffer.from(encodedData, 'base64');

        const iv = Decryptor.getValue(buffer, OctetIV);
        const salt = Decryptor.getValue(buffer, OctetSalt);
        const cipherContent = Decryptor.getValue(buffer, OctetCipherText);

        const encodedKey = iconv.encode(key, 'utf16le', {addBOM: false});
        const saltedKey = Decryptor.hashSaltPassword(salt, encodedKey);

        const cipher = forge.rc2.startDecrypting(forge.util.createBuffer(saltedKey), forge.util.createBuffer(iv), null);
        cipher.update(forge.util.createBuffer(cipherContent));
        cipher.finish();

        return iconv.decode(new Buffer(cipher.output.data, 'binary'), 'utf16le');
    }
}
