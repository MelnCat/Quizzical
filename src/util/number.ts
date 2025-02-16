export const convertNumber = (num: number) => {
	const lookup = { "▮": 50000, "▯": 10000, "▰": 5000, "▱": 1000, "◆": 500, "◇": 100, "▲": 50, "△": 10, "■": 5, "□": 1 };
	let str = "";
	for (const [k, v] of Object.entries(lookup)) {
		while (num >= v) {
			str += k;
			num -= v;
		}
	}
	return str;
};
