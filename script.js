class Ship {
	constructor(shipName, size) {
		this.shipName = shipName;
		this.size = size;
		this.shipGrid = [];
		for (let i = 0; i < size; i++) {
			this.shipGrid[i] = "ship";
		}
	}

	hit(position) {
		this.shipGrid[position] = "hit";
	}

	isSunk() {
		let sunk = (val) => val === "hit";
		return this.shipGrid.every((val) => sunk(val));
	}
}

class Gameboard {
	constructor(size) {
		this.grid = [];
		this.arrayUsed = [];
		this.shipArray = [];
		this.size = size;
		let row;
		for (let i = 0; i < size; i++) {
			row = [];
			for (let j = 0; j < size; j++) {
				row.push("water");
			}
			this.grid.push(row);
		}
	}

	placeShip(ship, rotation, row, column) {
		if (rotation === "horizontal") {
			for (let i = 0; i < ship.size; i++) {
				this.grid[row][column + i] = [ship, i];
			}
		}

		if (rotation === "vertical") {
			for (let i = 0; i < ship.size; i++) {
				this.grid[row + i][column] = [ship, i];
			}
		}

		this.shipArray.push(ship);
	}

	receiveAttack(row, column) {
		if (this.grid[row][column] === "water") {
			this.grid[row][column] = "miss";
			this.arrayUsed.push([row, column]);
			return "miss";
		} else {
			let ship = this.grid[row][column][0];
			ship.hit(this.grid[row][column][1]);
			// this.grid[row][column] = "hit";
			this.arrayUsed.push([row, column]);
			return "hit";
		}
	}

	allSunk() {
		return this.shipArray.every((ship) => {
			if (ship.isSunk()) return true;
		});
	}
}

class Player {
	constructor(playerName, gameboard) {
		this.playerName = playerName;
		this.gameboard = gameboard;
	}

	computerAI() {
		let newCoord = false;
		while (newCoord === false) {
			let x = Math.floor(Math.random() * 10);
			let y = Math.floor(Math.random() * 10);
			if (
				this.gameboard.arrayUsed.every((val) => {
					if (val[0] === x && val[1] === y) {
						return false;
					} else return true;
				})
			) {
				newCoord = true;
				return [x, y];
			}
		}
	}
}

const GameDOM = (() => {
	const screen = document.querySelector("#player1-screen");
	screen.classList.add("closed");

	function renderGrid(id, player) {
		const grid = document.querySelector(`#${id}`);
		for (let i = 0; i < player.gameboard.size; i++) {
			for (let j = 0; j < player.gameboard.size; j++) {
				const tile = document.createElement("div");
				tile.classList.add("tile");
				grid.append(tile);
			}
		}
	}

	function addTileEvent(id, player, ai) {
		const grid = document.querySelector(`#${id}`);
		let tile = grid.children;
		for (let i = 0; i < tile.length; i++) {
			tile[i].addEventListener(
				"click",
				() => {
					if (
						player.gameboard.receiveAttack(Math.floor(i / 10), i % 10) ===
						"miss"
					) {
						tile[i].setAttribute("style", "background-color: blue");
						const turnDisplay = document.querySelector("#turn");
						turnDisplay.textContent = "Computer Turn";
						setTimeout(() => {
							let miss = true;
							while (miss === true) {
								let aiCoord = ai.computerAI();
								let x = aiCoord[0];
								let y = aiCoord[1];
								if (aiTurn("grid1", ai, [x, y]) !== "hit") miss = false;
								else miss = true;
							}
							turnDisplay.textContent = "Player 1 Turn";
						}, 200);
						if (gameWon(player)) {
							const turnDisplay = document.querySelector("#turn");
							turnDisplay.textContent = `Computer Wins!`;
							return;
						}
					} else tile[i].setAttribute("style", "background-color: red");
					if (gameWon(player)) {
						const turnDisplay = document.querySelector("#turn");
						turnDisplay.textContent = `Player 1 Wins!`;
						return;
					}
					// const turnDisplay = document.querySelector("#turn");
					// turnDisplay.textContent = "Computer Turn";
					// setTimeout(() => {
					// 	let aiCoord = ai.computerAI();
					// 	let x = aiCoord[0];
					// 	let y = aiCoord[1];
					// 	aiTurn("grid1", ai, [x, y]);
					// 	turnDisplay.textContent = "Player 1 Turn";
					// }, 200);
					// if (gameWon(player)) {
					// 	const turnDisplay = document.querySelector("#turn");
					// 	turnDisplay.textContent = `Computer Wins!`;
					// 	return;
					// }
				},
				{ once: true }
			);
		}
	}

	function aiTurn(id, player, coord) {
		const grid = document.querySelector(`#${id}`);
		let tile = grid.children;
		if (player.gameboard.receiveAttack(coord[0], coord[1]) === "miss") {
			tile[coord[0] * 10 + coord[1]].setAttribute(
				"style",
				"background-color: blue"
			);
		} else {
			tile[coord[0] * 10 + coord[1]].setAttribute(
				"style",
				"background-color: red"
			);
			return "hit";
		}
	}

	function gameWon(player) {
		if (player.gameboard.allSunk()) {
			const screen = document.querySelector("#player2-screen");
			screen.classList.remove("closed");
			return player.gameboard.allSunk();
		}
	}

	function randomizeShips(shipArray, player) {
		for (let i = 0; i < shipArray.length; i++) {
			let direction = Math.floor(Math.random() * 2);
			if (direction === 0) {
				direction = "horizontal";
				let truthy = false;
				let x, y;
				while (truthy === false) {
					x = Math.floor(Math.random() * 10);
					y = Math.floor(Math.random() * shipArray[i].size);
					let checkArray = [];
					for (let k = 0; k < shipArray[i].size; k++) {
						checkArray.push(player.gameboard.grid[x][y + k]);
					}

					console.log(checkArray);
					if (
						checkArray.every((val) => {
							if (val === "water") return true;
						}) === true
					)
						truthy = true;
				}
				player.gameboard.placeShip(shipArray[i], "horizontal", x, y);
				console.log(`horizontal position ${[x, y]}`);
			}

			if (direction === 1) {
				direction = "vertical";

				let truthy = false;
				let x, y;

				while (truthy === false) {
					x = Math.floor(Math.random() * shipArray[i].size);
					y = Math.floor(Math.random() * 10);
					let checkArray = [];
					for (let k = 0; k < shipArray[i].size; k++) {
						checkArray.push(player.gameboard.grid[x + k][y]);
					}

					console.log(checkArray);
					if (
						checkArray.every((val) => {
							if (val === "water") return true;
						}) === true
					)
						truthy = true;
				}
				player.gameboard.placeShip(shipArray[i], "vertical", x, y);
				console.log(`vertical position ${[x, y]}`);
			}
		}
	}

	function placeShipsToDOM(id, shipArray, player) {
		const grid = document.querySelector(`#${id}`);
		const rotateBtn = document.querySelector(".rotate");
		const info = document.querySelector(".info");
		const startBtn = document.querySelector(".start-btn");
		const randomizeBtn = document.querySelector(".rnd-btn");
		const clearBtn = document.querySelector(".clear");
		let tile = grid.children;
		index = 0;
		let size = shipArray[index].size;
		let direction = "horizontal";
		info.textContent = `Place your ships!`;

		rotateBtn.addEventListener("click", () => {
			if (direction === "horizontal") direction = "vertical";
			else if (direction === "vertical") direction = "horizontal";
		});

		startBtn.addEventListener("click", () => {
			if (index === shipArray.length) {
				const menu = document.querySelector(".menu");
				menu.classList.add("closed");
				const screen = document.querySelector("#player1-screen");
				screen.classList.remove("closed");
				const turnDisplay = document.querySelector("#turn");
				turnDisplay.classList.remove("closed");
			}
		});

		randomizeBtn.addEventListener("click", () => {
			clearDOM(id, player);
			GameDOM.randomizeShips(shipArray, player);
			renderDOM(id, player);
			index = shipArray.length;
		});

		clearBtn.addEventListener("click", () => {
			clearDOM(id, player);
			renderDOM(id, player);
			index = 0;
		});

		for (let i = 0; i < tile.length; i++) {
			tile[i].addEventListener("mouseover", () => {
				// let size = shipArray[0].size;
				// let direction = "vertical";
				if (index !== shipArray.length) {
					if (tile[i].style.backgroundColor !== "lightblue") return false;
					if (
						direction === "horizontal" &&
						10 - shipArray[index].size >= i % 10
					) {
						for (let j = 0; j < shipArray[index].size; j++) {
							tile[i + j].setAttribute("style", "background: grey");
						}
					}

					if (
						direction === "vertical" &&
						10 - shipArray[index].size >= Math.floor(i / 10)
					) {
						for (let j = 0; j < shipArray[index].size; j++) {
							tile[i + j * 10].setAttribute("style", "background: grey");
						}
					}
				}

				// tile[i].setAttribute("style", "background: grey");
			});

			tile[i].addEventListener("mouseout", () => {
				// tile[i].setAttribute("style", "background: lightblue");
				// let size = shipArray[0].size;
				// let direction = "vertical";
				if (index !== shipArray.length) {
					if (direction === "horizontal" && 10 - size >= i % 10) {
						for (let j = 0; j < size; j++) {
							tile[i + j].setAttribute("style", "background: lightblue");
						}
					}

					if (direction === "vertical" && 10 - size >= Math.floor(i / 10)) {
						for (let j = 0; j < size; j++) {
							tile[i + j * 10].setAttribute("style", "background: lightblue");
						}
					}
				}

				renderDOM(id, player);
			});

			tile[i].addEventListener("click", () => {
				// tile[i].setAttribute("style", "background: lightblue");
				// let size = shipArray[0].size;
				// let direction = "vertical";
				// if (direction === "horizontal" && 10 - size >= i % 10) {
				// 	for (let j = 0; j < size; j++) {
				// 		tile[i + j].setAttribute("style", "background: grey");
				// 	}
				// }

				// if (direction === "vertical" && 10 - size >= Math.floor(i / 10)) {
				// 	for (let j = 0; j < size; j++) {
				// 		tile[i + j * 10].setAttribute("style", "background: grey");
				// 		tileClone = tile[i + j * 10].cloneNode(true);
				// 		tile[i + j * 10].parentNode.replaceChild(
				// 			tileClone,
				// 			tile[i + j * 10]
				// 		);
				// 	}
				// }
				if (index !== shipArray.length) {
					if (
						direction === "horizontal" &&
						10 - shipArray[index].size >= i % 10
					) {
						let checkArray = [];
						for (let k = 0; k < shipArray[index].size; k++) {
							checkArray.push(
								player.gameboard.grid[Math.floor(i / 10)][(i % 10) + k]
							);
						}

						console.log(checkArray);
						if (
							checkArray.every((val) => {
								if (val === "water") return true;
							}) === true
						) {
							player.gameboard.placeShip(
								shipArray[index],
								direction,
								Math.floor(i / 10),
								i % 10
							);
							if (index < shipArray.length) {
								index++;
							}
						}
						// if (index < shipArray.length) {
						// 	index++;
						// }
					}

					if (
						direction === "vertical" &&
						10 - shipArray[index].size >= Math.floor(i / 10)
					) {
						let checkArray = [];
						for (let k = 0; k < shipArray[index].size; k++) {
							checkArray.push(
								player.gameboard.grid[Math.floor(i / 10)][(i % 10) + k]
							);
						}

						console.log(checkArray);
						if (
							checkArray.every((val) => {
								if (val === "water") return true;
							}) === true
						) {
							player.gameboard.placeShip(
								shipArray[index],
								direction,
								Math.floor(i / 10),
								i % 10
							);
							if (index < shipArray.length) {
								index++;
							}
						}
						// player.gameboard.placeShip(
						// 	shipArray[index],
						// 	direction,
						// 	Math.floor(i / 10),
						// 	i % 10
						// );
						// if (index < shipArray.length) {
						// 	index++;
						// }
					}
				}
				if (index < shipArray.length) {
					info.textContent = `Place your ${shipArray[index].shipName}`;
				}

				// player.gameboard.placeShip(
				// 	shipArray[index],
				// 	direction,
				// 	Math.floor(i / 10),
				// 	i % 10
				// );

				renderDOM(id, player);
			});
		}

		// for (let i = 0; i < shipArray.length; i++){
		// 	player.gameboard.placeShip(shipArray[i], "horizontal", )
		// }
	}

	function renderDOM(id, player) {
		const grid = document.querySelector(`#${id}`);
		let tile = grid.children;

		for (let i = 0; i < player.gameboard.grid.length; i++) {
			for (let j = 0; j < player.gameboard.grid.length; j++) {
				if (player.gameboard.grid[i][j] === "water") {
					tile[i * 10 + j].setAttribute(
						"style",
						"background-color: lightblue;"
					);
				} else if (player.gameboard.grid[i][j] === "miss") {
					tile[i * 10 + j].setAttribute("style", "background-color: blue;");
				} else {
					tile[i * 10 + j].setAttribute("style", "background-color: grey;");
				}
			}
		}
	}

	function clearDOM(id, player) {
		const grid = document.querySelector(`#${id}`);
		let tile = grid.children;

		for (let i = 0; i < player.gameboard.grid.length; i++) {
			for (let j = 0; j < player.gameboard.grid.length; j++) {
				player.gameboard.grid[i][j] = "water";
			}
		}
	}

	return { renderGrid, addTileEvent, randomizeShips, placeShipsToDOM };
})();

function gameLoop() {
	let gameboard1 = new Gameboard(10);
	let gameboard2 = new Gameboard(10);

	// for (let i = 0; i < 9; i++) {
	// 	for (let j = 0; j < 9; j++) {
	// 		gameboard1.arrayMiss.push([i, j]);
	// 	}
	// }

	let player1 = new Player("Player 1", gameboard1);
	let player2 = new Player("Computer", gameboard2);

	let ship1 = new Ship("ship1", 3);
	let ship2 = new Ship("ship2", 3);
	let ship3 = new Ship("ship3", 5);
	let shipArray = [ship1, ship2, ship3];

	// GameDOM.randomizeShips(shipArray, player1);
	GameDOM.randomizeShips(shipArray, player2);

	// gameboard1.placeShip(ship1, "horizontal", 2, 2);
	// gameboard1.placeShip(ship2, "horizontal", 0, 0);
	// gameboard2.placeShip(ship3, "vertical", 0, 0);

	GameDOM.renderGrid("grid1", player1);
	GameDOM.renderGrid("grid2", player2);

	GameDOM.addTileEvent("grid2", player2, player1);
	GameDOM.placeShipsToDOM("grid1", shipArray, player1);
}

gameLoop();

//module.exports = { Ship, Gameboard, Player };
