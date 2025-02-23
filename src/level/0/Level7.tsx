import styles from "./levels.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { GameBox } from "../../component/GameBox";
import { HeaderBar } from "../../component/HeaderBar";
import { Background } from "../../component/shader/Background";
import { useFails, useLevel, useScore } from "../../util/hooks";
import { useEventListener, useInterval } from "usehooks-ts";
import { shuffled } from "../../util/util";
import { motion } from "motion/react";
	
export const Level7 = () => {
	const [level, setLevel, nextLevel] = useLevel();
	const [fail, setFails, addFail] = useFails();
	const [score, setScore] = useScore();
	return (
		<>
			<HeaderBar />
			<GameBox className={`${styles.noSelect}`}>
				<div className={styles.columns}>
					<div className={styles.gameBoard}>
						<h1>Dealer</h1>
						
					</div>
				</div>
			</GameBox>
		</>
	);
};
