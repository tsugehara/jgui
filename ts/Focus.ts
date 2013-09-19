module jgui {
	export class Focus extends jg.E {
		target:jg.E;
		color:any;
		constructor() {
			super();
			this.color = "#ffff00";
		}

		focus(target:jg.E) {
			this.target = target;
			if (target) {
				this.x = target.x;
				this.y = target.y;
				if (target.parent != this.parent) {
					if (this.parent)
						this.remove();
					target.parent.append(this);
				}
				this.width = target.width;
				this.height = target.height;
			}
			this.updated();
		}

		draw(context:CanvasRenderingContext2D) {
			if (! this.target)
				return;
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
}
