import "vite-plugin-glsl/ext";
declare module "react" {
	interface CSSProperties {
		[key: `--${string}`]: string | number | undefined;
	}
}