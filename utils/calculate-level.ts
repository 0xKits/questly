export function calculateLevel(exp: number) {
	return Math.floor(exp / 100);
}

export function progressToNextLevel(exp: number) {
	return 100 - (exp % 100);
}
