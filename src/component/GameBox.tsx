import styles from "./GameBox.module.scss";

export const GameBox = ({ children }: { children?: React.ReactNode}) => {
	return <section className={styles.box}>
		{children}
	</section>
}