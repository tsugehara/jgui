module jgui {
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
