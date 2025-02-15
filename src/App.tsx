import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { useLevel } from "./util/hooks";
import { levels } from "./level/levels";
import { GameBox } from "./component/GameBox";
import { Background } from "./component/shader/Background";

function App() {
	const [level, setLevel] = useLevel();
	if (level === 0)
		return (
			<main>
				<GameBox>
					<h1 className="page-title">Those Who Know</h1>
					<button onClick={() => setLevel(1)}>i am those who know</button>
					<div>Knws</div>
					<Background />
				</GameBox>
			</main>
		);
	return <main>{levels[level] ?? <div>oops</div>}</main>;
}

export default App;
