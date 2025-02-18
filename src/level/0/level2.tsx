import { useEffect, useMemo, useRef, useState } from "react";
import { useEventListener, useInterval } from "usehooks-ts";
import { GameBox } from "../../component/GameBox";
import { HeaderBar } from "../../component/HeaderBar";
import { useFails, useLevel, useScore } from "../../util/hooks";
import styles from "./levels.module.scss";

export const Level2 = () => {
	const [level, setLevel, nextLevel] = useLevel();
	const [fail, setFails, addFail] = useFails();
	const [score, setScore] = useScore();
	const [pos, setPos] = useState([279, 541]);
	const imageRef = useRef<HTMLImageElement>(null);
	const canvas = useMemo(() => new OffscreenCanvas(642, 642), []);
	const imageData = useRef<ImageData | null>(null);
	const held = useRef(new Set<string>());
	const getPixelAt = (x: number, y: number) => {
		const newX = Math.floor((642 * x) / 554);
		const newY = Math.floor((642 * y) / 554);
		if (!imageData.current) throw new Error("uh oh");
		const index = (newY * imageData.current.width + newX) * 4;
		return imageData.current.data.slice(index, index + 4);
	};
	const canMove = (sx: number, sy: number, dx: number, dy: number) => {
		if (dx === 0 && dy === 0) return false;
		let distance = 0;
		let x = sx;
		let y = sy;
		for (; getPixelAt(x, y)[3] === 0; x += dx, y += dy) distance++;
		return distance > 1;
	};
	useEffect(() => {
		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(imageRef.current!, 0, 0);
		imageData.current = ctx.getImageData(0, 0, 642, 642);
	});
	useEventListener("keydown", event => {
		if (event.key === "Escape") nextLevel();
		held.current.add(event.key);
	});
	useEventListener("keyup", event => {
		held.current.delete(event.key);
	});
	useInterval(() => {
		if (!imageRef.current) return;
		const leftHeld = held.current.has("a") || held.current.has("ArrowLeft");
		const rightHeld = held.current.has("d") || held.current.has("ArrowRight");
		const upHeld = held.current.has("w") || held.current.has("ArrowUp");
		const downHeld = held.current.has("s") || held.current.has("ArrowDown");
		const velocity = [(leftHeld ? -1 : 0) + (rightHeld ? 1 : 0), (upHeld ? -1 : 0) + (downHeld ? 1 : 0)];
		if (velocity[0] === 0 && velocity[1] === 0) return;
		const edges = [...Array(10)].flatMap((_, i) => [
			[pos[0] + i, pos[1] + (velocity[1] < 0 ? 0 : 9)],
			[pos[0] + (velocity[0] < 0 ? 0 : 9), pos[1] + i],
		]);
		if (edges.every(x => canMove(x[0], x[1], velocity[0], velocity[1]))) setPos(p => [p[0] + velocity[0], p[1] + velocity[1]]);
		else if (edges.every(x => canMove(x[0], x[1], velocity[0], 0))) setPos(p => [p[0] + velocity[0], p[1]]);
		else if (edges.every(x => canMove(x[0], x[1], 0, velocity[1]))) setPos(p => [p[0], p[1] + velocity[1]]);
	}, 10);
	useInterval(() => {
		setScore(x => Math.max(0, x - 1));
	}, 2000);
	return (
		<>
			<HeaderBar />
			<GameBox>
				<h1 className="title">Escape! (use your keyboard)</h1>
				<div className={styles.maze}>
					<img className={styles.mazeImg} src="/img/level0/maze.png" ref={imageRef} />
					<div className={styles.player} style={{ "--x": pos[0], "--y": pos[1] }} />
				</div>
			</GameBox>
		</>
	);
};
