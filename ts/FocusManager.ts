module jgui {
	export interface ISelfFocusControl extends jg.E {
		setFocusEntities(fm:FocusManager);
	}
	export class FocusManager {
		entities: jg.E[];
		game: jg.Game;
		focus: Focus;
		focusIndex: number;
		selected: jg.Trigger;
		changed: jg.Trigger;
		current: jg.E;

		constructor(game:jg.Game) {
			this.entities = [];
			this.game = game;
			this.current = null;
			this.selected = new jg.Trigger();
			this.changed = new jg.Trigger();
			this.focusIndex = -1;
		}

		addEntity(...e:jg.E[]) {
			for (var i=0; i<e.length; i++) {
				if ((<ISelfFocusControl>e[i]).setFocusEntities)
					(<ISelfFocusControl>e[i]).setFocusEntities(this);
				else
					this.entities.push(e[i]);
			}
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
			var old = this.current;
			if (this.focusIndex == -1)
				delete this.current;
			else
				this.current = this.entities[this.focusIndex];
			this.focus.focus(this.current);
			this.changed.fire({
				old: old,
				current: this.current
			});
		}

		start(focus?:Focus) {
			this.game.keyDown.handle(this, this.onKeyDown);
			this.focus = focus === undefined ? new Focus() : focus;
			this.game.scene.append(this.focus);
			this.updateFocus();
		}

		end() {
			this.game.keyDown.remove(this, this.onKeyDown);
			if (this.focus.parent)
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
