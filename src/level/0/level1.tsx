import { GameBox } from "../../component/GameBox";
import { Background } from "../../component/shader/Background";
import { useLevel } from "../../util/hooks";

export const Level1 = () => {
	const [level, setLevel] = useLevel();
	return (
		<GameBox className="title-box">
			<h1 className="page-title">Those Who Know</h1>
			<p>do you know?</p>
			<button onClick={() => setLevel(1)}>i am those who know</button>
			<Background />
		</GameBox>
	);
};
