export function isEmail(value: string): boolean {
	return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
}

export function isUsername(value: string): boolean {
	return /^[a-zA-Z0-9_\-]{3,16}$/.test(value);
}
