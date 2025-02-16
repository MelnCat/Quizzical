import { useLocalStorage } from "usehooks-ts";

export const useLevel = () => {
	const [score, setScore] = useScore();
	const [level, setLevel] = useLocalStorage("level", 0);
	return [level, setLevel, () => {
		setLevel(x => x + 1);
		setScore(x => x + 100);
	}] as const;
}
export const useFails = () => {
	const [score, setScore] = useScore();
	const [fails, setFails] = useLocalStorage("fails", 0);
	return [fails, setFails, () => {
		setFails(x => x + 1);
		setScore(x => Math.max(0, x - 20));
	}] as const;
}
export const useScore = () => useLocalStorage("score", 0)