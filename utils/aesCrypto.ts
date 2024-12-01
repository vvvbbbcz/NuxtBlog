import {textDecoder, textEncoder} from "~/utils/util";

async function getKeyFromPassword(password: string) {
	const passwordData = textEncoder.encode(password);
	const passwordHash = await crypto.subtle.digest("SHA-256", passwordData);
	return await crypto.subtle.importKey("raw", passwordHash,
		'AES-GCM', false, ["encrypt", "decrypt"]);
}

function encodeCiphertext(ciphertext: string) {
	const ciphertextArray = ciphertext.split('').map((x) => {
		const charCode = x.charCodeAt(0);
		return charCode - 32 > 126 ? charCode + 95 - 160 : charCode - 32;
	});
	return new Uint8Array(ciphertextArray);
}

function decodeCiphertext(ciphertextBuffer: ArrayBufferLike) {
	const ciphertext = Array.from(new Uint8Array(ciphertextBuffer));
	return ciphertext.map((b) => String.fromCharCode(b + 32 > 126 ? b - 95 + 160 : b + 32)).join('');
}

export function generateIV() {
	return crypto.getRandomValues(new Uint8Array(16));
}

export async function aesEncrypt(password: string, iv: Uint8Array, text: string) {
	const key = await getKeyFromPassword(password);
	const data = textEncoder.encode(text);

	const ciphertextBuffer = await crypto.subtle.encrypt({name: "AES-GCM", iv}, key, data);
	return decodeCiphertext(ciphertextBuffer);
}

export async function aesDecrypt(password: string, iv: Uint8Array, ciphertext: string) {
	const key = await getKeyFromPassword(password);

	const ciphertextBuffer = encodeCiphertext(ciphertext);
	return textDecoder.decode(await crypto.subtle.decrypt({name: "AES-GCM", iv}, key, ciphertextBuffer));
}
