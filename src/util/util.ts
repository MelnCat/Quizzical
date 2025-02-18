export const shuffled = <T>(list: T[]): T[] => {
	const copy = list.slice();
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export const shuffledDerangement = <T>(list: T[]): T[] => {
    const copy = [...list];
    const n = copy.length;

    for (let i = 0; i < n - 1; i++) {
        const j = Math.floor(Math.random() * (n - 1 - i) + i + 1);
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    if (copy[n - 1] === list[n - 1]) {
        [copy[n - 1], copy[n - 2]] = [copy[n - 2], copy[n - 1]];
    }

    return copy;
};
