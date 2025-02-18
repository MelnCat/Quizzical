import { useState } from "react";
import styles from "./DiscordToast.module.scss";
import { useInterval, useTimeout } from "usehooks-ts";
import { motion } from "motion/react";

const variants = {
	shown: { right: "1em" },
	hidden: { right: "-23.5em" },
};

export const DiscordToast = () => {
	const [state, setState] = useState("hidden");
	useTimeout(() => setState("shown"), 5000)
	useTimeout(() => setState("hidden"), 11000)
	return (
		<motion.div
			layout
			className={styles.box}
			variants={variants}
			animate={state}
			initial="hidden"
			
			transition={{
				duration: 0.4,
				delay: 0.5,
				ease: "easeOut"
			}}
		>
			<div className={styles.topBar}>
				<img className={styles.appLogo} src="/img/level0/discord.png" />
				<div className={styles.appName}>Discord</div>
				<div className={styles.close}>✕</div>
			</div>
			<div className={styles.bottomBar}>
				<img className={styles.leftImage} src="https://cdn.discordapp.com/avatars/895858806276378664/a044c0be4e88e26b5b8cd7ba1981f48e.webp?size=1024" />
				<div className={styles.details}>
					<div className={styles.title}>Dead (Bonebreaker) Meme (#new-genral-u-guess, general i guess)</div>
					<div className={styles.contents}>guys im gabe frfrfr</div>
				</div>
			</div>
		</motion.div>
	);
};
