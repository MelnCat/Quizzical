import styles from "./levels.module.scss";
import { useState } from "react";
import { GameBox } from "../../component/GameBox";
import { HeaderBar } from "../../component/HeaderBar";
import { Background } from "../../component/shader/Background";
import { useFails, useLevel } from "../../util/hooks";
import { useInterval } from "usehooks-ts";

const beanColors = ["red", "yellow", "blue"];
const randomBean = () => ({
	x: Math.random(),
	y: Math.random(),
	color: beanColors[Math.floor(Math.random() * 3)],
	id: Math.random(),
});
export const Level1 = () => {
	const [level, setLevel, nextLevel] = useLevel();
	const [beans, setBeans] = useState<{ x: number; y: number; color: string; id: number }[]>(() => [...Array(18)].map(() => randomBean()));
	const [fail, setFails, addFail] = useFails();
	useInterval(() => {
		setBeans(beans.concat(randomBean()));
	}, 200);
	return (
		<>
			<HeaderBar />
			<GameBox>
				<h1 className="title">How many jelly beans are in this jar?</h1>
				<div className={styles.jar}>
					<img className={styles.jarImg} src="/img/level0/jar.png" />
					{beans.map(x => (
						<img className={styles.bean} src={`/img/level0/bean/${x.color}.png`} style={{ "--x": x.x, "--y": x.y }} key={x.id} />
					))}
				</div>
				<div className="button-bar">
					<button onClick={() => addFail()}>{beans.length - 15}</button>
					<button onClick={nextLevel}>{beans.length}</button>
					<button onClick={() => addFail()}>{beans.length + 12}</button>
					<button onClick={() => addFail()}>{beans.length + 44}</button>
				</div>
			</GameBox>
		</>
	);
};
