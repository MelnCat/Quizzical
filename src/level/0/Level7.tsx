import styles from "./levels.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { GameBox } from "../../component/GameBox";
import { HeaderBar } from "../../component/HeaderBar";
import { Background } from "../../component/shader/Background";
import { useFails, useLevel, useScore } from "../../util/hooks";
import { useEventListener, useInterval } from "usehooks-ts";
import { shuffled } from "../../util/util";
import { motion } from "motion/react";

const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "↵"];

const generateCode = () =>
	Math.floor(Math.random() * 10000)
		.toString()
		.padStart(4, "0");
	

export const Level4 = () => {
	const [level, setLevel, nextLevel] = useLevel();
	const [fail, setFails, addFail] = useFails();
	const [score, setScore] = useScore();
	const [code, setCode] = useState("");
	const [target, setTarget] = useState(generateCode);
	const [keyPos, setKeyPos] = useState<[number, number][] | null>(null);
	useInterval(() => {
		if (keyPos) setKeyPos(keys.map(() => [Math.random() * 80 + 10, Math.random() * 80 + 10]))
	}, 4000)
	const onClick = (key: string | number) => {
		if (code === "XXXX" || code === "####") return;
		if (!keyPos) setKeyPos(keys.map(() => [Math.random() * 80 + 10, Math.random() * 80 + 10]))
		if (key === "C") {
			setCode("");
			return;
		}
		if (key === "↵") {
			if (code === target) {
				setCode("####");
				setTimeout(() => nextLevel(), 700);
			} else {
				addFail(false);
				setCode("XXXX");
				setTarget(generateCode);
				setTimeout(() => setCode(""), 700);
			}
			return;
		}
		if (code.length === 4 && typeof key === "number") return;
		setCode(code + key);
	};
	return (
		<>
			<HeaderBar />
			<GameBox className={`${styles.noSelect} ${keyPos ? styles.noMouse : ""}`}>
				<div className={styles.columns}>
					<div className={styles.keypad}>
						<div className={styles.keypadDisplay}>
							<div className={styles.keypadInner}>
								{code
									.padEnd(4, " ")
									.split("")
									.map((x, i) => (
										<span key={i}>{x}</span>
									))}
							</div>
						</div>
						{keys.map((x, i) => (
							<motion.button layout className={styles.keypadButton} layoutId={x.toString()} key={x} onMouseDown={() => onClick(x)} style={keyPos ? {
								position: "fixed",
								top: keyPos[i][1] + "%",
								left: keyPos[i][0] + "%"
							} : undefined}>
								{x}
							</motion.button>
						))}
					</div>
					<div className={styles.stickyNote}>The code: {target}</div>
				</div>
			</GameBox>
		</>
	);
};
