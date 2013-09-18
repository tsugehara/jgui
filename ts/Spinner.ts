module jgui {
	export class Spinner extends jg.E implements ISelfFocusControl {
		up_arrow: Arrow;
		down_arrow: Arrow;
		text_box: BorderLabel;
		changed: jg.Trigger;
		step: number;
		label_focus: boolean;
		arrow_height: number;
		text_align: string;

		constructor(width:number, height:number) {
			super();

			this.step = 1;

			this.width = width;
			this.height = height;
			this.arrow_height = 10;
			this.entities = [];

			this.enablePointingEvent();

			this.changed = new jg.Trigger();

			this.build();
		}

		build() {
			var value = "0";
			if (this.up_arrow)
				this.up_arrow.remove();
			if (this.down_arrow)
				this.down_arrow.remove();
			if (this.text_box) {
				value = this.text_box.text;
				this.text_box.remove();
			}
			this.up_arrow = new UpArrow(this.width, this.arrow_height);
			this.down_arrow = new DownArrow(this.width, this.arrow_height);
			this.text_box = new BorderLabel(value, this.height - this.arrow_height * 2 - 12);

			this.text_box.setTextAlign(this.text_align ? this.text_align : "right");
			var text_width = this.width - this.text_box.padding.left - this.text_box.padding.right;
			this.text_box.setMaxWidth(text_width);
			this.text_box.setFixWidth(text_width);

			this.append(this.up_arrow);
			this.append(this.down_arrow);
			this.append(this.text_box);

			this.up_arrow.moveTo(0, 0);
			this.down_arrow.moveTo(0, this.height - this.arrow_height);
			this.text_box.moveTo(0, this.arrow_height + 2);

			this.up_arrow.click.handle(this, this.onUp);
			this.down_arrow.click.handle(this, this.onDown);
		}

		setFocusEntities(fm:FocusManager) {
			if (this.label_focus)
				fm.addEntity(this.up_arrow, this.text_box, this.down_arrow);
			else
				fm.addEntity(this.up_arrow, this.down_arrow);
		}

		getValue():number {
			return Number(this.text_box.text);
		}

		setValue(value:number) {
			if (value != Math.round(value))
				this.text_box.setText((Math.round(value * 100) / 100).toString());
			else
				this.text_box.setText(value.toString());
			this.changed.fire(this);
		}

		onUp() {
			this.setValue(this.getValue() - this.step);
		}

		onDown() {
			this.setValue(this.getValue() + this.step);
		}
	}
}
