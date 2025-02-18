import { useLocalStorage } from "usehooks-ts";

export const useFailed = () => useLocalStorage("failed", false);

export const useLevel = () => {
	const [score, setScore] = useScore();
	const [level, setLevel] = useLocalStorage("level", 0);
	return [
		level,
		setLevel,
		() => {
			setLevel(level + 1);
			setScore(score + 100);
		},
	] as const;
};
let timeout = -1;
export const useFails = () => {
	const [score, setScore] = useScore();
	const [fails, setFails] = useLocalStorage("fails", 0);
	const [failed, setFailed] = useFailed();
	return [
		fails,
		setFails,
		(showIncorrect = true) => {
			setFails(fails + 1);
			setScore(Math.max(0, score - 20));
			if (showIncorrect) {
				setFailed(true);
				clearTimeout(timeout);
				timeout = setTimeout(() => setFailed(false), 500);
			}
		},
	] as const;
};
export const useScore = () => useLocalStorage("score", 0);
