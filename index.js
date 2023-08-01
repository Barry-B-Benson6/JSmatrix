const os = require("os");
const fs = require("fs");
const { stdout } = require("process");

class Grid{
	Values;
	constructor(){
		this.Values = [];
		for (let i = 0; i < process.stdout.columns; i++){
			this.Values[i] = [];
			for (let j = 0; j < process.stdout.rows; j++){
				this.Values[i][j] = " ";
			}
		}
	}


	Draw(){
		let outputStr = "";
		for (let j = 0; j < process.stdout.rows; j++){
			for (let i = 0; i < process.stdout.columns; i++){
				outputStr += this.Values[j][i];
				this.Values[j][i] = " ";
			}
			if (j != process.stdout.rows - 1){
				outputStr += os.EOL;
			}
		}
		outputStr += '\u001B[?25l'
		stdout.write(outputStr);
	}
}

class Stream{
	//C 
	length;
	//CPS
	speed;

	coloum;

	row;
	
	constructor(len,speed,col){
		this.length = len;
		this.speed = speed;
		this.coloum = col;
		this.row = 0;
	}

	Draw(Grid){
		if (this.row < process.stdout.rows){
			for (let i = 0; i < this.length; i++){
				if (this.row - i < 0) continue;
				//Grid.Values[this.row - i][this.coloum] = String.fromCharCode(Math.floor(Math.random() * 94) + 33)
				if (i == 0){
					Grid.Values[this.row - i][this.coloum] = "\x1b[38;2;255;255;255m"+String.fromCharCode(Math.floor(Math.random() * 94) + 33)+"\x1b[0m"
				}else{
					Grid.Values[this.row - i][this.coloum] = "\x1b[38;2;0;"+this.GetOpacityColor(i)+";0m"+String.fromCharCode(Math.floor(Math.random() * 94) + 33)+"\x1b[0m"
				}
			}
			//cursorTo(stdout, this.coloum, this.row);
			//stdout.write("\x1b[32m"+String.fromCharCode(Math.floor(Math.random() * 94) + 33)+"\x1b[0m");
		}
		this.row++;
		//this.row += this.speed;
	}

	ShouldDelete(){
		return this.row - this.length > process.stdout.rows;
	}

	GetOpacityColor(i = 0){
		return 255 - Math.floor((i/this.length)*255);
	}
}


process.on('SIGINT', function () {
	console.clear();
    process.exit(2);
});


let cols = [,];
for (let i = 0; i < process.stdout.columns; i++){
	cols[i] = [];
}
let grid = new Grid();
setInterval(()=>{
	for (let i = 0; i < cols.length; i++){
		if (Math.random() > 0.96){
			cols[i].push(new Stream(
					Math.floor(Math.random()*15 + 5),
					Math.ceil(Math.random()*2),
					i
				)
			);
		}
	}
	
	
	for (let i = 0; i < cols.length; i++){
		cols[i].forEach((stream)=>{
			stream.Draw(grid);
			if (stream.ShouldDelete()){
				cols[i] = cols[i].filter(function(arrStream) { return arrStream != stream; }); 
			}
		});
	}
	grid.Draw();
},100);