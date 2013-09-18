module jgui {
	export class BorderLabel extends jg.Label {
		border_color: any;
		border: HTMLCanvasElement;
		padding: jg.Rectangle;
		background: any;
		fix_width: number;

		constructor(text?:string, fontSize?:number, fontColor?:string, baseline?:string) {
			this.padding = new jg.Rectangle(4, 4, 4, 4);
			super(text, fontSize, fontColor, baseline);
			this.setBorder(["#ABADB3", "#E2E3EA", "#E2E3EA", "#E2E3EA"]);
		}

		setPadding(padding:jg.Rectangle) {
			this.padding = padding;
			this.updateSize();
		}

		setBackground(background:any) {
			this.setBorder(this.border_color, background);
		}

		setFixWidth(width:number) {
			this.fix_width = width;
			this.updateSize();
		}

		setBorder(color:any, background?:any) {
			this.border_color = color;
			var canvas = window.createCanvas(this.width, this.height);
			var c = canvas.getContext("2d");

			if (background) {
				if (background instanceof HTMLCanvasElement || background instanceof HTMLImageElement) {
					c.drawImage(
						background,
						0,
						0,
						background.width,
						background.height,
						0,
						0,
						this.width,
						this.height
					);
				} else {
					c.beginPath();
					c.fillStyle = background;
					c.fillRect(0, 0, this.width, this.height);
				}				
				this.background = background;
			}

			c.lineWidth = 2;
			if (this.border_color instanceof Array) {
				c.beginPath();
				c.strokeStyle = this.border_color[0];
				c.moveTo(0, 0);
				c.lineTo(this.width, 0);
				c.stroke();

				c.beginPath();
				c.strokeStyle = this.border_color[1];
				c.moveTo(this.width, 0);
				c.lineTo(this.width, this.height);
				c.stroke();

				c.beginPath();
				c.strokeStyle = this.border_color[2];
				c.moveTo(this.width, this.height);
				c.lineTo(0, this.height);
				c.stroke();

				c.beginPath();
				c.strokeStyle = this.border_color[3];
				c.moveTo(0, this.height);
				c.lineTo(0, 0);
				c.stroke();
			} else if (this.border_color) {
				c.beginPath();
				c.strokeStyle = this.border_color;
				c.rect(0, 0, this.width, this.height);
				c.stroke();
			}
			this.border = canvas;
			this.updated();
		}

		updateSize() {
			super.updateSize();
			if (this.fix_width)
				this.width = this.fix_width;
			this.width += this.padding.left + this.padding.right;
			this.height += this.padding.top + this.padding.bottom;
			this.setBorder(this.border_color, this.background);
		}
		
		draw(context:CanvasRenderingContext2D) {
			context.drawImage(
				this.border,
				0,
				0
			);
			var textAlign = this.getDrawOption("textAlign");
			switch(textAlign) {
				case "right":
				case "end":
					context.translate(
						this.width - this.padding.left,
						this.padding.top
					);
				break;
				case "center":
					context.translate(
						this.width / 2,
						this.padding.top
					);
				break;
				default:
					context.translate(
						this.padding.left,
						this.padding.top
					);
			}
			super.draw(context);
		}
	}
}