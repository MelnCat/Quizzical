import "./App.scss";
import { DiscordToast } from "./component/DiscordToast";
import { GameBox } from "./component/GameBox";
import { HeaderBar } from "./component/HeaderBar";
import { Background } from "./component/shader/Background";
import { SteamToast } from "./component/SteamToast";
import { levels } from "./level/levels";
import { useFailed, useLevel } from "./util/hooks";

function App() {
	const [level, setLevel] = useLevel();
	const [failed, setFailed] = useFailed();
	const Level = levels[level];
	const internals =
		level === 0 ? (
			<>
				<HeaderBar />
				<GameBox className="title-box">
					<h1 className="page-title">Those Who Know</h1>
					<p>do you know?</p>
					<button className="title-button" onClick={() => setLevel(1)}>
						i am those who know
					</button>
					<SteamToast />
					<DiscordToast />
				</GameBox>
			</>
		) : Level ? (
			<Level />
		) : (
			<div>oops</div>
		);

	return (
		<main>
			{internals}
			<Background />
			{failed && <div className="incorrect">INCORRECT</div>}
		</main>
	);
}

export default App;
