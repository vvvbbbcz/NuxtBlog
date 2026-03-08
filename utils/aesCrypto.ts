const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function getKeyFromPassword(password: string) {
    const passwordData = textEncoder.encode(password);
    const passwordHash = await crypto.subtle.digest("SHA-256", passwordData);
    return await crypto.subtle.importKey("raw", passwordHash,
        'AES-GCM', false, ["encrypt", "decrypt"]);
}

function encodeCipherText(cipherText: string) {
    const cipherTextArray = cipherText.split('').map((x) => {
        const charCode = x.charCodeAt(0);
        return charCode - 32 > 126 ? charCode + 95 - 160 : charCode - 32;
    });
    return new Uint8Array(cipherTextArray);
}

function decodeCipherText(cipherTextBuffer: ArrayBufferLike) {
    const cipherText = Array.from(new Uint8Array(cipherTextBuffer));
    return cipherText.map((b) => String.fromCharCode(b + 32 > 126 ? b - 95 + 160 : b + 32)).join('');
}

export function generateIV() {
    return crypto.getRandomValues(new Uint8Array(16));
}

export async function aesEncrypt(password: string, iv: Uint8Array, text: string) {
    const key = await getKeyFromPassword(password);
    const data = textEncoder.encode(text);

    const cipherTextBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv.slice() }, key, data);
    return decodeCipherText(cipherTextBuffer);
}

export async function aesDecrypt(password: string, iv: Uint8Array, cipherText: string) {
    const key = await getKeyFromPassword(password);

    const cipherTextBuffer = encodeCipherText(cipherText);
    return textDecoder.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv.slice() }, key, cipherTextBuffer));
}
