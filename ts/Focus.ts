module jgui {
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
}
