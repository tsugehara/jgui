module jgui {
	export enum ButtonState {
		Normal,
		Down
	}

	export class Button extends jg.E {
		bg1:HTMLCanvasElement;
		bg2:HTMLCanvasElement;
		state:ButtonState;
		click:jg.Trigger;

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
			this.click = new jg.Trigger();
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
				color1 = jg.JGUtil.createLinearGradient(
					new jg.Rectangle(this.width / 2, 0, this.width / 2, this.height),
					["rgba(240,240,255,1)", "rgba(80, 120, 190, 1)"]
				);
			}
			if (! color2) {
				color2 = jg.JGUtil.createLinearGradient(
					new jg.Rectangle(this.width / 2, 0, this.width / 2, this.height),
					["rgba(240,240,255,1)", "rgba(240,240,255,1)", "rgba(80, 120, 190, 1)"],
					[0, 0.1, 1]
				);
			}
			this.bg1 = this._createBg(color1);
			this.bg2 = this._createBg(color2);
		}

		onPointDown(e:jg.InputPointEvent) {
			this.stateChange(ButtonState.Down);
		}

		onPointMove(e:jg.InputPointEvent) {
			if (this.hitTest(e.point))
				this.stateChange(ButtonState.Down);
			else
				this.stateChange(ButtonState.Normal);
		}

		onPointUp(e:jg.InputPointEvent) {
			this.stateChange(ButtonState.Normal);

			if (this.hitTest(e.point))
				this.click.fire(this);
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
		label:jg.Label;
		constructor(text:string, width:number, height:number, color1?:any, color2?:any) {
			super(width, height, color1, color2);
			this.label = new jg.Label(text);
			this.label.setMaxWidth(this.width);
			this.label.setTextAlign("center");
			this.label.setTextBaseline("middle");
			this.entities = [];
			this.append(this.label);
			this.label.moveTo(this.width / 2, this.height / 2);
		}

		getText() {
			return this.label.text;
		}
		setText(text:string) {
			this.label.setText(text);
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

	export class Focus extends jg.E {
		target:jg.E;
		color:any;
		constructor() {
			super();
			this.disableTransform = true;
			this.color = "#ffff00";
		}

		focus(target:jg.E) {
			this.target = target;
		}

		draw(context:CanvasRenderingContext2D) {
			if (! this.target)
				return;
			context.translate(this.target.x, this.target.y);
			this.scene.game.renderer.useDrawOption(this.target, context);
			context.beginPath();
			context.strokeStyle = this.color;
			context.lineWidth = 3;
			context.rect(
				0,
				0,
				this.target.width,
				this.target.height
			);
			context.stroke();
		}
	}

	export class FocusManager {
		entities:jg.E[];
		game:jg.Game;
		focus:Focus;
		focusIndex:number;
		selected:jg.Trigger;

		constructor(game:jg.Game) {
			this.entities = [];
			this.game = game;
			this.selected = new jg.Trigger();
		}

		addEntity(...e:jg.E[]) {
			for (var i=0; i<e.length; i++)
				this.entities.push(e[i]);
		}

		removeEntity(...e:jg.E[]) {
			var entities = [];
			for (var i=0, j; i<this.entities.length; i++) {
				for (j=0; j<e.length; j++) {
					if (this.entities[i] == e[j]) {
						break;
					}
				}
				if (j == e.length)
					entities.push(this.entities[i]);
			}
			this.entities = entities;
			if (this.focusIndex >= this.entities.length) {
				if (this.entities.length == 0)
					this.focusIndex = -1;
				else
					this.focusIndex = 0;
				this.updateFocus();
			}
		}

		clearEntity() {
			this.entities = [];
		}

		setFocus(e:jg.E) {
			for (var i=0; i<this.entities.length; i++) {
				if (e == this.entities[i]) {
					this.focusIndex = i;
					this.updateFocus();
					break;
				}
			}
		}

		updateFocus() {
			if (this.focusIndex == -1)
				delete this.focus.target;
			else {
				this.focus.target = this.entities[this.focusIndex];
				this.focus.updated();
			}
		}

		start(layer?:jg.Layer) {
			this.game.keyDown.handle(this, this.onKeyDown);
			this.focus = new Focus();
			if (layer)
				layer.append(this.focus);
			else
				this.game.scene.append(this.focus);
			this.focusIndex = -1;
			this.updateFocus();
		}

		end() {
			this.game.keyDown.remove(this, this.onKeyDown);
			this.focus.remove();
		}

		onKeyDown(e:jg.InputKeyboardEvent) {
			switch (e.key) {
			case jg.Keytype.Left:
			case jg.Keytype.Up:
				this.focusIndex--;
				if (this.focusIndex < 0)
					this.focusIndex = this.entities.length - 1;
				this.updateFocus();
			break;
			case jg.Keytype.Right:
			case jg.Keytype.Down:
				this.focusIndex++;
				if (this.focusIndex >= this.entities.length)
					this.focusIndex = 0;
				this.updateFocus();
			break;
			case jg.Keytype.Enter:
				if (this.focus.target)
					this.selected.fire(this.focus.target);
			break;
			}
		}
	}
}