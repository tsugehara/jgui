module jgui {
	export class ListBox extends jg.E {
		row_height: number;
		layer: jg.Layer;
		padding: jg.Rectangle;
		focus_manager: FocusManager;
		bg: any;
		up_scroll_button: Arrow;
		down_scroll_button: Arrow;
		inner_focus: number;
		pointing_entity:jg.E;

		constructor(scene:jg.Scene, width:number, height:number, row_height?:number) {
			super();
			this.scene = scene;
			this.width = width;
			this.height = height;
			this.layer = new jg.Layer(scene);
			this.layer.parent = this;
			this.layer.width = this.width;
			this.layer.height = this.height;
			this.layer.createBuffer();
			this.layer.scrollTo(0, 0);
			this.row_height = row_height ? row_height : 20;
			this.padding = new jg.Rectangle(4, 4, 4, 4);

			this.up_scroll_button = new UpArrow(24, 16);
			this.down_scroll_button = new DownArrow(24, 16);
			this.entities = [];
			this.append(this.up_scroll_button);
			this.append(this.down_scroll_button);
			this.up_scroll_button.moveTo(
				this.width - this.up_scroll_button.width,
				0
			);
			this.up_scroll_button.click.handle(this, this.onUp);
			this.down_scroll_button.moveTo(
				this.width - this.down_scroll_button.width,
				this.height - this.down_scroll_button.height
			);
			this.down_scroll_button.click.handle(this, this.onDown);

			this.enablePointingEvent();

			this.inner_focus = 0;
			this.updateScrollStatus();

			this.pointDown.handle(this, this.onPointDown);
			this.pointMove.handle(this, this.onPointMove);
			this.pointUp.handle(this, this.onPointUp);
		}

		//layerに登録されているイベントにはポイントイベントが伝わらないので、自前で伝える
		//このためListBoxは自分のポイントイベントと子供のイベントが二重に発生するようになっている
		onPointDown(e:jg.InputPointEvent) {
			var p = {
				x: e.point.x - this.layer.scroll.x,
				y: e.point.y - this.layer.scroll.y
			}
			this.pointing_entity = this.layer.getEntityByPoint(p);
			if (this.pointing_entity && this.pointing_entity.pointDown) {
				var e2 = new jg.InputPointEvent(
					jg.InputEventAction.Down,
					e.param,
					p
				);
				e2.set(this.pointing_entity);
				this.pointing_entity.pointDown.fire(e2)
			}
		}
		onPointMove(e:jg.InputPointEvent) {
			var p = {
				x: e.point.x - this.layer.scroll.x,
				y: e.point.y - this.layer.scroll.y
			}
			if (this.pointing_entity && this.pointing_entity.pointMove) {
				var e2 = new jg.InputPointEvent(
					jg.InputEventAction.Move,
					e.param,
					p
				);
				e2.set(this.pointing_entity);
				this.pointing_entity.pointMove.fire(e2)
			}
		}
		onPointUp(e:jg.InputPointEvent) {
			var p = {
				x: e.point.x - this.layer.scroll.x,
				y: e.point.y - this.layer.scroll.y
			}
			if (this.pointing_entity && this.pointing_entity.pointUp) {
				var e2 = new jg.InputPointEvent(
					jg.InputEventAction.Up,
					e.param,
					p
				);
				e2.set(this.pointing_entity);
				this.pointing_entity.pointUp.fire(e2)
			}
		}

		updateScrollStatus() {
			var index = this.inner_focus;
			var ypos = index * this.row_height + this.layer.scroll.y;
			var visible_height = this.getVisibleHeight();
			var is_scroll = false;
			if ((ypos+this.row_height) > visible_height) {
				this.layer.scrollBy(0, visible_height - ypos - this.row_height);
				is_scroll = true;
			} else if (ypos < 0) {
				this.layer.scrollBy(0, -ypos);
				is_scroll = true;
			} else
				this.layer.updated();

			if (this.layer.scroll.y < 0)
				this.up_scroll_button.opacity = 0.5;
			else
				this.up_scroll_button.opacity = 0;

			if ((visible_height - this.layer.scroll.y) < (this.layer.entities.length * this.row_height))
				this.down_scroll_button.opacity = 0.5;
			else
				this.down_scroll_button.opacity = 0;
			
			return is_scroll;
		}

		setFocusEntities(fm:FocusManager) {
			if (this.focus_manager !== undefined)
				throw "can not reset focusmanager";
			this.focus_manager = fm;
			var entities = this.layer.entities;
			for (var i=0; i<entities.length; i++)
				fm.addEntity(entities[i]);
			this.focus_manager.changed.handle(this, this.onFocusChanged);
			this.updateScrollStatus();
		}

		onUp() {
			if (this.up_scroll_button.opacity == 0)
				return;
			do {
				this.inner_focus--;
				if (this.inner_focus < 0)
					this.inner_focus += this.layer.entities.length;
			} while(!this.updateScrollStatus());
		}

		onDown() {
			if (this.down_scroll_button.opacity == 0)
				return;
			do {
				this.inner_focus++;
				if (this.inner_focus >= this.layer.entities.length)
					this.inner_focus -= this.layer.entities.length;
			} while(!this.updateScrollStatus());
		}

		onFocusChanged(e:any) {
			var target:jg.E = e.current;
			var index = this.findItem(target);
			if (index >= 0) {
				this.inner_focus = index;
				this.updateScrollStatus();
			}
		}

		findItem(entity:jg.E) {
			var entities = this.layer.entities;
			for (var i=0; i<entities.length; i++) {
				if (entities[i] == entity)
					return i;
			}
			return -1;
		}

		moveToLeft(entity:jg.E) {
			entity.x = this.padding.left;
		}

		moveToCenter(entity:jg.E) {
			entity.x = (this.width - this.padding.left - this.padding.right) / 2 - entity.width / 2;
		}

		moveToRight(entity:jg.E) {
			entity.x = (this.width - this.padding.right) - entity.width;
		}

		addItem(entity:jg.E, manual_refresh?:boolean) {
			entity.x = 0;
			entity.y = this.layer.entities.length * this.row_height;
			if (entity instanceof jg.Label) {
				var label = <jg.Label>entity;
				if (entity instanceof BorderLabel) {
					var bl = <BorderLabel>label;
					bl.padding = new jg.Rectangle(
						this.padding.left,
						this.padding.top,
						this.padding.right,
						this.padding.bottom
					);
					var bl_width = this.width - bl.padding.left - bl.padding.right;
					bl.setMaxWidth(bl_width);
					bl.setFixWidth(bl_width);
					bl.setFontSize(this.row_height - bl.padding.top - bl.padding.bottom);
				} else {
					label.y += this.padding.top;
					label.x += this.padding.left;
					label.setMaxWidth(this.width - this.padding.left - this.padding.right);
					label.setFontSize(this.row_height - this.padding.top - this.padding.bottom);
				}
				label.updateSize();
			} else {
				entity.x += this.padding.left;
				entity.y += this.padding.top;
			}
			this.layer.append(entity);
			this.updateScrollStatus();
		}

		setBg(bg:any) {
			this.bg = (bg instanceof jg.E) ? bg.createSprite().image : bg;
			if (this.bg.width != this.width || this.bg.height != this.height) {
				var canvas = window.createCanvas(this.width, this.height);
				var context = canvas.getContext("2d");
				context.drawImage(
					this.bg,
					0,
					0,
					this.bg.width,
					this.bg.height,
					0,
					0,
					this.width,
					this.height
				);
				this.bg = canvas;
			}
			this.updated();
		}

		getVisibleHeight() {
			return Math.floor((this.height - this.padding.top) / this.row_height) * this.row_height;
		}

		draw(context:CanvasRenderingContext2D) {
			if (this.bg) {
				context.drawImage(this.bg, 0, 0);
			} else {
				context.save();
				context.lineWidth = 1;
				context.beginPath();
				context.rect(0, 0, this.width, this.height);
				context.stroke();
				context.restore();
			}

			//Note: Layerの更新判定はしない
			var layer = this.layer;
			this.layer.context.clearRect(0, 0, this.layer.width, this.layer.height);
			this.scene.game.renderer.renderParent(this.layer, this.layer.context);
			layer.isUpdated = false;

			var visible_height = this.getVisibleHeight();	//Note: ほんとはtopじゃなくてbottomかも？
			context.drawImage(
				this.layer.canvas,
				0,
				0,
				this.width,
				visible_height,
				0,
				0,
				this.width,
				visible_height
			);
		}

		destroy() {
			super.destroy();
			this.layer.destroy();
		}
	}
}