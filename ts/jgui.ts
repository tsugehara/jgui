module jgui {
	export enum ButtonState {
		Normal,
		Down
	}

	export class Button extends E {
		bg1:HTMLCanvasElement;
		bg2:HTMLCanvasElement;
		state:ButtonState;
		click:Trigger;

		constructor(width:number, height:number, color1?:any, color2?:any) {
			super();
			this.moveTo(0, 0);
			this.width = width;
			this.height = height;
			this.enablePointingEvent();
			this.pointDown.handle(this, this.onPointDown);
			this.pointMove.handle(this, this.onPointMove);
			this.pointUp.handle(this, this.onPointUp);
			this.createBg(color1, color2);
			this.state = ButtonState.Normal;
			this.click = new Trigger();
		}

		focus() {

		}

		_createBg(color:any) {
			var canvas = window.createCanvas(this.width, this.height);
			var ctx = canvas.getContext("2d");
			ctx.beginPath();
			var w = this.width;
			var h = this.height;
			var r = 8;
			ctx.arc(r    , r    , r, -Math.PI      , -0.5 * Math.PI, false);
			ctx.arc(w - r, r    , r, -0.5 * Math.PI, 0             , false);
			ctx.arc(w - r, h - r, r, 0             , 0.5 * Math.PI , false);
			ctx.arc(r    , h - r, r, 0.5 * Math.PI , Math.PI       , false);
			ctx.closePath();
			ctx.fillStyle = color;
			ctx.fill();
			return canvas;
		}

		createBg(color1?:any, color2?:any) {
			if (! color1) {
				color1 = JGUtil.createLinearGradient(
					new Rectangle(this.width / 2, 0, this.width / 2, this.height),
					["rgba(240,240,255,1)", "rgba(80, 120, 190, 1)"]
				);
			}
			if (! color2) {
				color2 = JGUtil.createLinearGradient(
					new Rectangle(this.width / 2, 0, this.width / 2, this.height),
					["rgba(240,240,255,1)", "rgba(240,240,255,1)", "rgba(80, 120, 190, 1)"],
					[0, 0.1, 1]
				);
			}
			this.bg1 = this._createBg(color1);
			this.bg2 = this._createBg(color2);
		}

		onPointDown(e:InputPointEvent) {
			this.stateChange(ButtonState.Down);
		}

		onPointMove(e:InputPointEvent) {
			if (this.hitTest(e.point))
				this.stateChange(ButtonState.Down);
			else
				this.stateChange(ButtonState.Normal);
		}

		onPointUp(e:InputPointEvent) {
			this.stateChange(ButtonState.Normal);

			if (this.hitTest(e.point))
				this.click.fire();
		}

		stateChange(state:ButtonState) {
			if (this.state != state) {
				this.state = state;
				this.updated();
			}
		}

		draw(context:CanvasRenderingContext2D) {
			var img;
			img = (this.state == ButtonState.Normal) ? this.bg1 : this.bg2;
			context.drawImage(
				img,
				0,
				0,
				this.width,
				this.height,
				0,
				0,
				this.width,
				this.height
			);
		}
	}

	export class TextButton extends Button {
		label:Label;
		constructor(text:string, width:number, height:number, color1?:any, color2?:any) {
			super(width, height, color1, color2);
			this.label = new Label(text);
			this.label.setMaxWidth(this.width);
			this.label.setTextAlign("center");
			this.label.setTextBaseline("middle");
			this.entities = new E[];
			this.append(this.label);
			this.label.moveTo(this.width / 2, this.height / 2);
		}

		stateChange(state:ButtonState) {
			if (this.state != state) {
				if (this.state == ButtonState.Down) {
					this.label.y -= 2;
				} else {
					this.label.y += 2;
				}
				super.stateChange(state);
			}
		}
	}
}