module jgui {
	export class Arrow extends Button {
		_createBg(color:any) {
			var canvas = window.createCanvas(this.width, this.height);
			var ctx = canvas.getContext("2d");
			ctx.beginPath();
			var w = this.width;
			var h = this.height;
			ctx.moveTo(0, h);
			ctx.lineTo(w, h);
			ctx.lineTo(w / 2, 0);
			ctx.closePath();
			ctx.fillStyle = color;
			ctx.fill();
			return canvas;
		}

		draw(context:CanvasRenderingContext2D) {
			var img, y;
			if (this.state == ButtonState.Normal) {
				img = this.bg1;
				y = 0;
			} else {
				img = this.bg2;
				y = Math.max(this.height * 0.1, 2);
			}

			context.drawImage(
				img,
				0,
				0,
				this.width,
				this.height,
				0,
				0+y,
				this.width,
				this.height-y
			);
		}
	}

	export class DownArrow extends Arrow {
		_createBg(color:any) {
			var bg = super._createBg(color);
			var canvas = window.createCanvas(this.width*2, this.height*2);
			var ctx = canvas.getContext("2d");
			ctx.save();
			ctx.translate(this.width, this.height);
			ctx.rotate(180 * (Math.PI / 180));
			ctx.drawImage(bg, 0, 0);
			ctx.restore();
			return canvas;
		}

		draw(context:CanvasRenderingContext2D) {
			var img, y;
			if (this.state == ButtonState.Normal) {
				img = this.bg1;
				y = 0;
			} else {
				img = this.bg2;
				y = Math.max(this.height * 0.1, 2);
			}

			context.drawImage(
				img,
				0,
				0,
				this.width,
				this.height,
				0,
				0,
				this.width,
				this.height-y
			);
		}
	}

	export class UpArrow extends Arrow {
	}

	export class LeftArrow extends Arrow {
		_createBg(color:any) {
			var w = this.width;
			var h = this.height;
			this.width = h;
			this.height = w;
			var bg = super._createBg(color);
			this.width = w;
			this.height = h;

			var canvas = window.createCanvas(this.width*2, this.height*2);
			var ctx = canvas.getContext("2d");
			ctx.save();
			ctx.translate(0, this.height);
			ctx.rotate(-90 * (Math.PI / 180));
			ctx.drawImage(bg, 0, 0);
			ctx.restore();
			return canvas;
		}

		draw(context:CanvasRenderingContext2D) {
			var img, y;
			if (this.state == ButtonState.Normal) {
				img = this.bg1;
				y = 0;
			} else {
				img = this.bg2;
				y = Math.max(this.height * 0.1, 2);
			}

			context.drawImage(
				img,
				0,
				0,
				this.width,
				this.height,
				y,
				0,
				this.width-y,
				this.height
			);
		}
	}

	export class RightArrow extends Arrow {
		_createBg(color:any) {
			var w = this.width;
			var h = this.height;
			this.width = h;
			this.height = w;
			var bg = super._createBg(color);
			this.width = w;
			this.height = h;

			var canvas = window.createCanvas(this.width*2, this.height*2);
			var ctx = canvas.getContext("2d");
			ctx.save();
			ctx.translate(this.width, 0);
			ctx.rotate(90 * (Math.PI / 180));
			ctx.drawImage(bg, 0, 0);
			ctx.restore();
			return canvas;
		}

		draw(context:CanvasRenderingContext2D) {
			var img, y;
			if (this.state == ButtonState.Normal) {
				img = this.bg1;
				y = 0;
			} else {
				img = this.bg2;
				y = Math.max(this.height * 0.1, 2);
			}

			context.drawImage(
				img,
				0,
				0,
				this.width,
				this.height,
				0	,
				0,
				this.width-y,
				this.height
			);
		}
	}
}