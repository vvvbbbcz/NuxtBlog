export default async function sha256sum(value: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(value);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	// convert bytes to hex string
	return hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}