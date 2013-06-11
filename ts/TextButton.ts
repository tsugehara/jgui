module jgui {
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
}
