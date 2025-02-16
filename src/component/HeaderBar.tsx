import { useScore } from "../util/hooks";
import { convertNumber } from "../util/number";
import styles from "./HeaderBar.module.scss";

export const HeaderBar = ({ children, className }: { children?: React.ReactNode, className?: string}) => {
	const [score, setScore] = useScore();
	return <section className={`${styles.header} ${className}`}>
		{convertNumber(score)}
	</section>
}