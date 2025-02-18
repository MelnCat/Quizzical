import styles from "./levels.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { GameBox } from "../../component/GameBox";
import { HeaderBar } from "../../component/HeaderBar";
import { Background } from "../../component/shader/Background";
import { useFails, useLevel, useScore } from "../../util/hooks";
import { useEventListener, useInterval } from "usehooks-ts";
import mix from "mix-color";

const overlapping = (x1: number, w1: number, x2: number, w2: number) => {
	return x1 < x2 + w2 && x2 < x1 + w1;
};

export const Level3 = () => {
	const [level, setLevel, nextLevel] = useLevel();
	const [fail, setFails, addFail] = useFails();
	const [score, setScore] = useScore();
	const [pos, setPos] = useState(0);
	const [fishPos, setFishPos] = useState(0.4);
	const [progress, setProgress] = useState(4 / 7);
	const [state, setState] = useState(0);
	const fishVelocity = useRef(0);
	const velocity = useRef(0);
	const mouseDown = useRef(false);
	const overlap = overlapping(pos, 4 / 18, fishPos + 1.3 / 18 / 2 - 0.5 / 18, 1 / 18);
	const fishTarget = useRef(0.5);
	const color = progress < 0.5 ? mix("#aa0000", "#cccc00", progress * 2) : mix("#cccc00", "#00aa00", (progress - 0.5) * 2);
	const secondColor = mix(color, "#000000", 0.2);
	useInterval(() => {
		fishTarget.current = Math.random();
	}, 1500);
	useEventListener("mousedown", () => (mouseDown.current = true));
	useEventListener("mouseup", () => (mouseDown.current = false));
	useInterval(() => {
		if (state !== 0) return;
		if (pos < 0.001) {
			if (velocity.current < -0.001) velocity.current = -velocity.current * 0.5;
		} else velocity.current -= 0.0015;
		if (1 - 4 / 18 - pos < 0.001) {
			if (velocity.current > 0) velocity.current = -velocity.current * 0.5;
		}
		if (mouseDown.current) velocity.current += 0.0027;
		setPos(x => Math.max(0, Math.min(1 - 4 / 18, x + velocity.current)));
		if (fishPos < 0.001) if (fishVelocity.current < 0) fishVelocity.current = 0;
		if (1 - 1.3 / 18 - fishPos < 0.001) if (fishVelocity.current > 0) fishVelocity.current = 0;
		fishVelocity.current += (Math.random() - 0.5) * 0.001;
		fishVelocity.current += (fishTarget.current - fishPos) * 0.003;
		setFishPos(Math.min(1 - 1.3 / 18, Math.max(0, fishPos + fishVelocity.current)));
		setProgress(progress + (overlap ? 0.006 : -0.006));
		if (progress < 0) {
			setState(-1);
			addFail(false);
			setTimeout(() => setState(0), 500);
			setPos(0);
			setProgress(0.5);
			setFishPos(0.5);
		} else if (progress > 1) {
			setState(1);
			setTimeout(() => nextLevel(), 2000);
		}
	}, 20);
	return (
		<>
			<HeaderBar />
			<GameBox className={styles.noSelect}>
				<h1 className="title">you know what that means</h1>
				{state === 1 ? (
					<>
						<div>FISH</div>
						<img src="/img/level0/killerfish.webp" className="medium-img" />
					</>
				) : state === -1 ? (
					<img src="/img/level0/largefish.webp" className="large-img" />
				) : (
					<div className={styles.barContainer}>
						<div className={styles.fishBar}>
							<div className={styles.fishBox} style={{ "--y": pos }} />
							<div className={styles.fish} style={{ "--y": fishPos }} {...(overlap ? { "data-hooking": true } : null)}>
								🐟
							</div>
						</div>
						<div
							className={styles.progressBar}
							style={{ backgroundImage: `linear-gradient(transparent, transparent ${100 - 100 * progress}%, ${color} ${100 - 100 * progress}%, ${secondColor})` }}
						/>
					</div>
				)}
			</GameBox>
		</>
	);
};
