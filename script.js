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
	constructor(turnOrder, gameboard){
		this.turnOrder = turnOrder;
		this.gameboard = gameboard;
	}

	computerAI(){
		this.gameboard.
	}
}

module.exports = { Ship, Gameboard, Player };
