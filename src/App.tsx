import "./App.scss";
import { useLevel } from "./util/hooks";
import { levels } from "./level/levels";
import { GameBox } from "./component/GameBox";
import { Background } from "./component/shader/Background";
import { SteamToast } from "./component/SteamToast";
import { HeaderBar } from "./component/HeaderBar";

function App() {
	const [level, setLevel] = useLevel();
	if (level === 0)
		return (
			<main>
				<HeaderBar />
				<GameBox className="title-box">
					<h1 className="page-title">Those Who Know</h1>
					<p>do you know?</p>
					<button onClick={() => setLevel(1)}>i am those who know</button>
					<Background />
					<SteamToast />
				</GameBox>
			</main>
		);
	return <main>{levels[level] ?? <div>oops</div>}</main>;
}

export default App;
