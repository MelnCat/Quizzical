import { Canvas } from "glsl-canvas-js";
import { useEffect, useRef } from "react";
import styles from "./Background.module.scss";
import bg from "./glsl/bg.frag";

export const Background = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	useEffect(() => {
		const options = {
			fragmentString: bg
		}
		const glsl = new Canvas(canvasRef.current!, options);
		return (() => {
			if (glsl.gl) glsl.destroy();
		})
	}, []);
	return <canvas ref={canvasRef} width={1000} height={1000} className={styles.background} />;
};
