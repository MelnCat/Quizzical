import styles from "./GameBox.module.scss";

export const GameBox = ({ children, className }: { children?: React.ReactNode, className?: string}) => {
	return <section className={`${styles.box} ${className}`}>
		{children}
	</section>
}