import { useFailed, useScore } from "../util/hooks";
import { convertNumber } from "../util/number";
import styles from "./HeaderBar.module.scss";

export const HeaderBar = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
	const [score, setScore] = useScore();
	const [failed, setFailed] = useFailed();
	return (
		<section className={`${styles.header} ${className}`} {...(failed ? { "data-failed": true } : null)}>
			<div className={styles.count}>{convertNumber(score)}</div>
		</section>
	);
};
