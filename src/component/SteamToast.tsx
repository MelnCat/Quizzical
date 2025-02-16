import { useState } from "react";
import styles from "./SteamToast.module.scss";
import { useInterval, useTimeout } from "usehooks-ts";
import { motion } from "motion/react";

const variants = {
	shown: { bottom: 0 },
	hidden: { bottom: "-7em" },
};

export const SteamToast = () => {
	const [state, setState] = useState("shown");
	useTimeout(() => setState("hidden"), 4000)
	return (
		<motion.div
			layout
			className={styles.box}
			variants={variants}
			animate={state}
			initial="hidden"
			transition={{
				duration: 0.25,
				delay: 0.5,
			}}
		>
			<div className={styles.image}>
				<img src="https://avatars.fastly.steamstatic.com/d595668fb056db1b262383bc5310b89334cd6056_medium.jpg" />
			</div>
			<div className={styles.details}>
				<div className={styles.name}>PikPik</div>
				<div className={styles.label}>is playing</div>
				<div className={styles.game}>NEKOPARA Vol. 1</div>
			</div>
		</motion.div>
	);
};
