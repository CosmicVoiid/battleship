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
		this.arrayMiss = [];
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
			this.arrayMiss.push([row, column]);
			return "miss";
		} else {
			let ship = this.grid[row][column][0];
			ship.hit(this.grid[row][column][1]);
			this.grid[row][column] = "hit";
		}
	}

	allSunk() {
		return this.shipArray.every((ship) => {
			if (ship.isSunk()) return true;
		});
	}
}

class Player {
	constructor(turnOrder, gameboard) {
		this.turnOrder = turnOrder;
		this.gameboard = gameboard;
	}

	computerAI() {
		let newCoord = false;
		while (newCoord === false) {
			let x = Math.floor(Math.random() * 10);
			let y = Math.floor(Math.random() * 10);
			if (
				this.gameboard.arrayMiss.every((val) => {
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
	function renderGrid(id, gameboard) {
		const grid = document.querySelector(`#${id}`);
		console.log(grid);
		for (let i = 0; i < gameboard.size; i++) {
			for (let j = 0; j < gameboard.size; j++) {
				const tile = document.createElement("div");
				if (gameboard.grid[i][j] !== "water") {
					console.log(gameboard.grid[i][j]);
					tile.textContent = gameboard.grid[i][j][0].shipName;
				} else tile.textContent = gameboard.grid[i][j];
				grid.appendChild(tile);
			}
		}
	}

	return { renderGrid };
})();

function gameLoop() {
	let gameboard1 = new Gameboard(10);
	let gameboard2 = new Gameboard(10);

	let player1 = new Player(1, gameboard1);
	let player2 = new Player(2, gameboard2);

	let ship1 = new Ship("ship1", 3);
	let ship2 = new Ship("ship2", 3);
	console.log(gameboard1.grid);

	gameboard1.placeShip(ship1, "horizontal", 4, 2);
	gameboard1.placeShip(ship2, "horizontal", 0, 0);

	GameDOM.renderGrid("grid1", gameboard1);
}

gameLoop();

//module.exports = { Ship, Gameboard, Player };
