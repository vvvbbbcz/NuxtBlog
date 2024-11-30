export function isEmail(value: string): boolean {
	return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
}

export function isUrlName(value: string): boolean {
	return /^[a-zA-Z][a-zA-Z0-9_\-]*[a-zA-Z0-9]$/.test(value);
}

export function isUsername(value: string): boolean {
	return /^[a-zA-Z0-9_\-]{3,16}$/.test(value);
}
