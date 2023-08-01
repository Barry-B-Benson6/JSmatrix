const os = require("os");
const fs = require("fs");
const { stdout } = require("process");

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

	Draw(){
			for (let i = 0; i <= this.length; i++){
				if (this.row - i < 0) continue;
				if (this.row - i > stdout.rows) continue;
				if (i == 0){
					stdout.cursorTo(this.coloum, this.row - i);
					stdout.write("\x1b[38;2;255;255;255m"+String.fromCharCode(Math.floor(Math.random() * 94) + 33)+"\x1b[0m");
				}else{
					stdout.cursorTo(this.coloum, this.row - i);
					stdout.write("\x1b[38;2;0;"+this.GetOpacityColor(i)+";0m"+String.fromCharCode(Math.floor(Math.random() * 94) + 33)+"\x1b[0m");
				}
			}
			stdout.cursorTo(this.coloum, this.row - this.length - 1);
			stdout.write(" ");
		//this.row++;
		this.row += this.speed;
	}

	ShouldDelete(){
		return (this.row - this.length) > process.stdout.rows;
	}

	GetOpacityColor(i = 0){
		return 255 - Math.floor((i/this.length)*255);
	}

	Delete(){
		for (let i = 0; i < this.length; i++){
			if (this.row - i < 0) continue;
			stdout.cursorTo(this.coloum, this.row - i);
			stdout.write(" ");
		}
		stdout.cursorTo(this.coloum, this.row - this.length);
		stdout.write(" ");
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

setInterval(()=>{
	for (let i = 0; i < cols.length; i++){
		if (Math.random() > 0.97){
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
			if (stream.ShouldDelete()){
				stream.Delete();
				cols[i] = cols[i].filter(function(arrStream) { return arrStream != stream; });
			}else{
				stream.Draw();
			}
		});
	}
},40);