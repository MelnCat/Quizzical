import { useEffect, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import { Canvas } from "glsl-canvas-js";
import bg from "./glsl/bg.frag";

export const Background = () => {
	const [time, setTime] = useState(0);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	useEffect(() => {
		const options = {
			fragmentString: bg,
			alpha: false,
			antialias: true,
			mode: "flat",
			extensions: ["EXT_shader_texture_lod"],
		};
		const glsl = new Canvas(canvasRef.current!, options);
	}, []);
	useInterval(() => setTime(x => x + 1), 1);
	return <canvas ref={canvasRef} width={300} height={300} />;
};
