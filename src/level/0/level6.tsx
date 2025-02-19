import styles from "./levels.module.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { GameBox } from "../../component/GameBox";
import { HeaderBar } from "../../component/HeaderBar";
import { Background } from "../../component/shader/Background";
import { useFails, useLevel, useScore } from "../../util/hooks";
import { useEventListener, useInterval } from "usehooks-ts";
import { shuffled } from "../../util/util";
import { motion } from "motion/react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { CounterSeven, Delete } from "@nine-thirty-five/material-symbols-react/outlined";
const count = (ingr: string[]) => ({ bread: 0, ham: 0, cheese: 0, lettuce: 0, ...ingr.reduce((l, c) => (l[c] ? l[c]++ : (l[c] = 1), l), {} as Record<string, number>) });

const randomCode = () => {
	const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	return [...Array(6)].map(x => (Math.random() < 0.5 ? numbers[Math.floor(Math.random() * numbers.length)] : letters[Math.floor(Math.random() * letters.length)])).join("");
};
interface Order {
	name: string;
	description: string;
	validate(ingredients: string[]): boolean;
	count?: number;
}
const orders: Order[] = [
	{
		name: "Ham & Cheese Sandwich",
		description: "A simple sandwich consisting of ham and cheese.",
		validate: (ingr: string[]) => {
			const counts = count(ingr);
			return (
				Object.values(counts).every(x => x < 5) &&
				counts.bread === 2 &&
				counts.ham > 0 &&
				counts.cheese > 0 &&
				counts.lettuce === 0 &&
				ingr[0] === "bread" &&
				ingr.at(-1) === "bread"
			);
		},
	},
	{
		name: "Ham & Lettuce Sandwich",
		description: "A sandwich with both meat and vegetables.",
		validate: (ingr: string[]) => {
			const counts = count(ingr);
			return (
				Object.values(counts).every(x => x < 5) &&
				counts.bread === 2 &&
				counts.ham > 0 &&
				counts.cheese === 0 &&
				counts.lettuce > 0 &&
				ingr[0] === "bread" &&
				ingr.at(-1) === "bread"
			);
		},
	},
	{
		name: "Deluxe Sandwich",
		description: "A sandwich with ham, cheese, and lettuce.",
		validate: (ingr: string[]) => {
			const counts = count(ingr);
			return (
				Object.values(counts).every(x => x < 5) &&
				counts.bread === 2 &&
				counts.ham > 0 &&
				counts.cheese > 0 &&
				counts.lettuce > 0 &&
				ingr[0] === "bread" &&
				ingr.at(-1) === "bread"
			);
		},
	},
	{
		name: "Double-Decker Meat & Cheese Sandwich",
		description: "A two-layered sandwich with meat and cheese on both layers.",
		validate: (ingr: string[]) => {
			const breads = [...ingr.entries()].filter(x => x[1] === "bread").map(x => x[0]);
			const left = ingr.slice(1, breads[1]);
			const right = ingr.slice(breads[1], -1);
			const counts = count(ingr);
			return (
				Object.values(counts).every(x => x < 7) &&
				counts.bread === 3 &&
				ingr[0] === "bread" &&
				ingr.at(-1) === "bread" &&
				left.includes("ham") &&
				left.includes("cheese") &&
				right.includes("ham") &&
				right.includes("cheese") &&
				!ingr.includes("lettuce")
			);
		},
	},
	{
		name: "Double-Decker Deluxe Sandwich",
		description: "A two-layered sandwich with meat, cheese, and lettuce on both layers.",
		validate: (ingr: string[]) => {
			const breads = [...ingr.entries()].filter(x => x[1] === "bread").map(x => x[0]);
			const left = ingr.slice(1, breads[1]);
			const right = ingr.slice(breads[1], -1);
			const counts = count(ingr);
			return (
				Object.values(counts).every(x => x < 7) &&
				counts.bread === 3 &&
				ingr[0] === "bread" &&
				ingr.at(-1) === "bread" &&
				left.includes("ham") &&
				left.includes("cheese") &&
				left.includes("lettuce") &&
				right.includes("ham") &&
				right.includes("lettuce") &&
				right.includes("cheese")
			);
		},
	},
];
const finalOrders: Order[] = [
	{
		name: "Cheese",
		description: "Ten servings of cheese.",
		validate: ingr => {
			const counts = count(ingr);
			return counts.cheese === 10 && counts.ham === 0 && counts.bread === 0 && counts.lettuce === 0;
		},
	},
	{
		name: "The Meat-Lover's Special",
		description: "A sandwich containing at least 40 pieces of ham.",
		validate: ingr => {
			const counts = count(ingr);
			return counts.bread === 2 && counts.ham >= 40 && counts.cheese === 0 && counts.lettuce === 0 && ingr[0] === "bread" && ingr.at(-1) === "bread";
		},
	},
	{
		name: "Quintuple-Decker Ultra-Deluxe Omega Sandwich",
		description: "A five-layered sandwich with two pieces of ham, two pieces of cheese, and two pieces lettuce on each layer.",
		validate: ingr => {
			const breads = [...ingr.entries()].filter(x => x[1] === "bread").map(x => x[0]);
			const layers = breads.slice(1).map((x, i) => ingr.slice(breads[i] + 1, x));
			return (
				layers.length === 5 &&
				ingr[0] === "bread" &&
				ingr.at(-1) === "bread" &&
				layers.every(x => {
					const counts = count(x);
					return counts.cheese >= 2 && counts.ham >= 2 && counts.lettuce >= 2;
				})
			);
		},
	},
];

const Ingredient = ({ type, ingredientCount }: { type: string; ingredientCount: number }) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: type,
	});
	const style = {
		transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
		zIndex: transform ? 5 : ingredientCount > 10 ? 0 : undefined,
	};
	return (
		<div className={styles.ingredient}>
			<img src={`/img/level0/${type}.png`} className={styles.ingredientBack} />
			<img src={`/img/level0/${type}.png`} ref={setNodeRef} style={style} {...listeners} {...attributes} />
		</div>
	);
};
const Plate = ({ ingredients }: { ingredients: string[] }) => {
	const { isOver, setNodeRef, active } = useDroppable({
		id: "plate",
	});
	const style = {
		border: isOver && active?.id !== "sandwich" ? "3px solid black" : undefined,
	};

	return (
		<div style={style} className={styles.plate}>
			<Sandwich ingredients={ingredients} ref={setNodeRef} />
		</div>
	);
};
const Trash = () => {
	const { isOver, setNodeRef } = useDroppable({
		id: "trash",
	});

	return (
		<div ref={setNodeRef} className={styles.trash} style={{ backgroundColor: isOver ? "#6a6a6a" : "" }}>
			<Delete className={styles.trashIcon} />
		</div>
	);
};

export const Sandwich = ({ ingredients, ref }: { ingredients: string[]; ref: (element: HTMLElement | null) => void }) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: "sandwich",
	});
	const style = {
		transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : "",
		height: `calc(5em + ${6 * ingredients.length}px)`,
		translate: `-2px ${-6 * ingredients.length - 4}px`
	};
	return (
		<div
			ref={e => {
				setNodeRef(e);
				ref(e);
			}}
			style={style}
			{...listeners}
			{...attributes}
			className={styles.sandwich}
		>
			{ingredients.map((x, i) => (
				<img src={`/img/level0/${x}.png`} key={i} className={styles.placedIngredient} style={{ transform: `translateY(${-i * 6}px)` }} />
			))}
		</div>
	);
};

const Delivery = () => {
	const { isOver, setNodeRef } = useDroppable({
		id: "delivery",
	});
	return <div ref={setNodeRef} className={styles.delivery} style={{ borderColor: isOver ? "#708966" : "" }} />;
};

export const Level6 = () => {
	const [level, setLevel, nextLevel] = useLevel();
	const [fail, setFails, addFail] = useFails();
	const [score, setScore] = useScore();
	const [ingredients, setIngredients] = useState<string[]>([]);
	const [remaining, setRemaining] = useState<(Order & { code: string })[]>(() =>
		shuffled(orders.flatMap(x => [...Array(x.count)].fill(x)).map(x => ({ ...x, code: randomCode() })))
			.concat(finalOrders.map(x => ({ ...x, code: `${randomCode()}-X` })))

			.reverse()
	);
	const onDragEnd = (event: DragEndEvent) => {
		if (!event.over) return;
		if (event.over.id === "plate" && event.active.id !== "sandwich") {
			setIngredients(ingredients.concat(event.active.id as string));
		}
		if (event.over.id === "trash" && event.active.id === "sandwich") {
			setIngredients([]);
		}
		if (event.over.id === "delivery" && event.active.id === "sandwich") {
			if (remaining.length === 0) return;
			const current = remaining.at(-1)!;
			if (!current.validate(ingredients)) addFail(true);
			else {
				setScore(score + 25);
				setIngredients([]);
				setRemaining(remaining.slice(0, -1));
				if (remaining.length === 1)
					setTimeout(() => {
						nextLevel();
					}, 2000);
			}
		}
	};
	return (
		<>
			<HeaderBar />
			<GameBox className={`${styles.noSelect}`}>
				<div className={styles.columns}>
					<DndContext onDragEnd={onDragEnd}>
						<div className={styles.kitchen}>
							<div className={styles.kitchenCounter}>
								<Ingredient ingredientCount={ingredients.length} type="bread" />
								<Ingredient ingredientCount={ingredients.length} type="ham" />
								<Ingredient ingredientCount={ingredients.length} type="cheese" />
								<Ingredient ingredientCount={ingredients.length} type="lettuce" />
							</div>
							<div className={styles.drawer} />
							<div className={styles.table}>
								<Trash />
								<Plate ingredients={ingredients} />
								<Delivery />
							</div>
						</div>
					</DndContext>
					<div className={styles.orders}>
						{remaining.length ? (
							remaining.map(x => (
								<div className={styles.orderContainer} key={x.code}>
									<div className={styles.order}>
										<p className={styles.orderCode}>{x.code}</p>
										<h1>{x.name}</h1>
										<p>{x.description}</p>
									</div>
								</div>
							))
						) : (
							<div className={styles.noOrders}>
								<h1>No orders remaining!</h1>
							</div>
						)}
					</div>
				</div>
			</GameBox>
		</>
	);
};
