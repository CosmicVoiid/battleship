const { Ship, Gameboard, Player } = require("./script");

test("create a ship object", () => {
	const ship = new Ship("ship", 4);
	expect(ship.shipGrid).toEqual(["ship", "ship", "ship", "ship"]);
});

test("check if ship is not sunk", () => {
	const ship = new Ship("ship", 4);
	expect(ship.isSunk()).toBe(false);
});

test("check if ship is sunk", () => {
	const ship = new Ship("ship", 3);
	ship.shipGrid = ["hit", "hit", "hit"];
	expect(ship.isSunk()).toBe(true);
});

test("check if gameboard has 10 arrays", () => {
	const gameboard = new Gameboard(10);
	expect(gameboard.grid.length).toEqual(10);
});

test("check if gameboard has 10 rows each with contents of 'water'", () => {
	const gameboard = new Gameboard(10);
	for (let i = 0; i < gameboard.size; i++) {
		expect(gameboard.grid[i]).toEqual([
			"water",
			"water",
			"water",
			"water",
			"water",
			"water",
			"water",
			"water",
			"water",
			"water",
		]);
	}
});

test("check if gameboard can place ships horizontally", () => {
	const gameboard = new Gameboard(10);
	const ship = new Ship("ship", 4);
	gameboard.placeShip(ship, "horizontal", 4, 2);
	expect(gameboard.grid[4]).toEqual([
		"water",
		"water",
		[ship, 0],
		[ship, 1],
		[ship, 2],
		[ship, 3],
		"water",
		"water",
		"water",
		"water",
	]);
});

test("check if gameboard can place ships vertically", () => {
	const gameboard = new Gameboard(10);
	const ship = new Ship("ship", 3);
	gameboard.placeShip(ship, "vertical", 4, 2);
	expect(gameboard.grid[5][2]).toEqual([ship, 1]);
});

test("check if receiveAttack function returns miss coordinates 0, 0", () => {
	const gameboard = new Gameboard(10);
	expect(gameboard.receiveAttack(0, 0)).toEqual("miss");
});

test("check if receiveAttack function returns hit coordinates 1, 0", () => {
	const gameboard = new Gameboard(10);
	const ship = new Ship("ship", 3);
	gameboard.placeShip(ship, "horizontal", 1, 0);
	gameboard.receiveAttack(1, 0);
	expect(gameboard.grid[1][0]).toEqual("hit");
});

test("check if ship has registered a hit", () => {
	const gameboard = new Gameboard(10);
	const ship = new Ship("ship", 3);
	gameboard.placeShip(ship, "horizontal", 1, 0);
	gameboard.receiveAttack(1, 1);
	expect(ship.shipGrid).toEqual(["ship", "hit", "ship"]);
});

test("check if gameboard records miss coordinates", () => {
	const gameboard = new Gameboard(10);
	gameboard.receiveAttack(0, 0);
	gameboard.receiveAttack(1, 1);
	expect(gameboard.arrayMiss).toEqual([
		[0, 0],
		[1, 1],
	]);
});

test("check if gameboard allSunk works", () => {
	const gameboard = new Gameboard(10);
	const ship1 = new Ship("ship1", 3);
	gameboard.placeShip(ship1, "horizontal", 0, 0);
	gameboard.receiveAttack(0, 0);
	gameboard.receiveAttack(0, 1);
	gameboard.receiveAttack(0, 2);

	const ship2 = new Ship("ship2", 2);
	gameboard.placeShip(ship2, "horizontal", 5, 0);
	gameboard.receiveAttack(5, 0);
	gameboard.receiveAttack(5, 1);
	expect(gameboard.allSunk()).toBe(true);
});

test("test computer AI if it returns random coordinates", () => {
	const gameboard1 = new Gameboard(10);
	const playerAI = new Player(1, gameboard1);
	expect(typeof playerAI.computerAI()).toBe("object");
});

test("test computer AI if it returns unused coordinates", () => {
	const gameboard1 = new Gameboard(10);
	const playerAI = new Player(1, gameboard1);
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 9; j++) {
			gameboard1.arrayMiss.push([i, j]);
		}
	}
	playerAI.computerAI();
	console.log(playerAI.computerAI());
	console.log(gameboard1.arrayMiss);
	expect(playerAI.computerAI()).not.toBe([3, 3]);
});
