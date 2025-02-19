import styles from "./levels.module.scss";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { GameBox } from "../../component/GameBox";
import { HeaderBar } from "../../component/HeaderBar";
import { Background } from "../../component/shader/Background";
import { useFails, useLevel, useScore } from "../../util/hooks";
import { useEventListener, useInterval, useTimeout } from "usehooks-ts";
import { shuffled, shuffledDerangement } from "../../util/util";
import { motion } from "motion/react";
import useSound from "use-sound";
import metalPipe from "/audio/pipe.mp3";
import limbo from "/audio/limbo.mp3";
import pineapple from "/audio/pineapple.mp3";
import sus from "/audio/sus.mp3";
import vineBoom from "/audio/vineboom.mp3";
import tree from "/audio/tree.mp3";
import maxwell from "/audio/maxwell.mp3";
import confetti from "/audio/confetti.mp3";

const getDuration = (speed: number) => Math.max(0.01, 2 / (1 + speed ** 2 * 0.1));
const images = ["itemasylum", "metalpipe", "limbo", "pineapple", "sus", "smallmoyai", "tree", "maxwell"];
export const Level5 = () => {
	const [level, setLevel, nextLevel] = useLevel();
	const [fail, setFails, addFail] = useFails();
	const [score, setScore] = useScore();
	const [order, setOrder] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
	const [opened, setOpened] = useState<number[]>([]);
	const [state, setState] = useState(0);
	const [keyBox, setKeyBox] = useState(4);
	const [speed, setSpeed] = useState(1);
	const [largeImage, setLargeImage] = useState<string | null>(null);
	const speedRef = useRef(1);
	const movingRef = useRef(true);
	const [playPipe] = useSound(metalPipe);
	const [playLimbo] = useSound(limbo);
	const [playPineapple] = useSound(pineapple);
	const [playSus] = useSound(sus);
	const [playVineBoom] = useSound(vineBoom);
	const [playTree] = useSound(tree);
	const [playMaxwell, maxwellOptions] = useSound(maxwell);
	const [playConfetti] = useSound(confetti);
	const [extra, setExtra] = useState<ReactNode | null>(null);
	const move = () => {
		speedRef.current++;
		setSpeed(speedRef.current);
		if (movingRef.current) setTimeout(() => move(), getDuration(speedRef.current) * 1000);
		else setTimeout(() => setState(3), getDuration(speedRef.current) * 1000);
		setOrder(shuffledDerangement(order));
	};
	useTimeout(() => {
		setState(1);
		setTimeout(() => {
			setState(2);
			move();
			setTimeout(() => {
				movingRef.current = false;
			}, 10000);
		}, 800);
	}, 1000);
	const openBox = (i: number) => {
		if (state !== 3) return;
		if (opened.includes(i)) return;
		const newOpened = opened.concat(i);
		setOpened(newOpened);
		if (newOpened.length === 8) setKeyBox(order.find(x => !newOpened.includes(x)) ?? 4);
		const index = newOpened.length - 1;
		if (index === 0) {
			const link = document.createElement("a");
			link.href = "roblox://placeId=5670218884/";
			link.click();
		} else if (index === 6) {
			playTree();
			setLargeImage("/img/empty.png");
			setTimeout(() => {
				setLargeImage("/img/level0/tree.jpg");
				setTimeout(() => setLargeImage(null), 3200);
			}, 1700);
		} else
			setTimeout(() => {
				if (index === 1) {
					playPipe();
					setLargeImage("/img/level0/metalpipe.png");
					setTimeout(() => setLargeImage(null), 2000);
				}
				if (index === 2) {
					playLimbo();
					setExtra(<video src="/video/limbo.mp4" autoPlay className="large-img" loop />);
					setTimeout(() => setExtra(null), 5000);
				}
				if (index === 3) {
					playPineapple();
					setLargeImage("/img/level0/pineapple.png");
					setTimeout(() => setLargeImage(null), 500);
				}
				if (index === 4) {
					playSus();
					setLargeImage("/img/level0/sus.png");
					setTimeout(() => setLargeImage(null), 1500);
				}
				if (index === 5) {
					playVineBoom();
					setLargeImage("/img/level0/largemoyai.webp");
					setTimeout(() => setLargeImage(null), 700);
				}
				if (index === 7) {
					playMaxwell();
				}
				if (index === 8) {
					maxwellOptions.stop();
					playConfetti();
					setTimeout(() => {
						nextLevel();
					}, 1000);
				}
			}, 500);
	};
	return (
		<>
			<HeaderBar />
			<GameBox className={`${styles.noSelect}`}>
				<div className={styles.mysteryBoxContainer}>
					{order.map((x, i) => {
						const isKey = x === 4 && state === 0;
						return (
							<motion.div
								layout
								className={styles.mysteryBox}
								key={i}
								style={{ order: order[i], cursor: state === 3 ? "pointer" : "not-allowed" }}
								animate={{
									pointerEvents: opened.includes(i) ? "none" : "unset",
								}}
								onClick={() => openBox(i)}
								transition={{ duration: getDuration(speed), ease: "linear" }}
							>
								<motion.div
									className={styles.mysteryBoxCover}
									transition={{ duration: 0.5 }}
									animate={{
										opacity: isKey || opened.includes(i) ? 0 : 1,
										translate: opened.includes(i) ? `0 -100%` : "0 0",
									}}
									initial={{ translate: "0 0" }}
								>
									?
								</motion.div>
								{(x === 4 && state <= 1) || (opened.length > 8 && keyBox === i) ? <span className={styles.secretKey}>🔑</span> : null}
								{opened.indexOf(i) in images && images[opened.indexOf(i)] ? (
									<img src={`/img/level0/${images[opened.indexOf(i)]}.png`} className={styles.mysteryReward} />
								) : null}
							</motion.div>
						);
					})}
				</div>
				{largeImage && <img src={largeImage} className="large-img" />}
				{extra}
			</GameBox>
		</>
	);
};
