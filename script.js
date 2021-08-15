class Ship {
	constructor(shipName, size) {
		this.shipName = shipName;
		this.size = size;
		this.ship = [];
		for (let i = 0; i < size; i++) {
			this.ship[i] = "clear";
		}
	}

	hit(position) {
		this.ship[position] = "hit";
	}

	isSunk() {
		for (let i = 0; i < this.size; i++) {}
	}

	showShip() {
		console.log(this.ship);
	}
}

const ship1 = new Ship("battleship", 4);

module.exports = Ship;
