var jgui;
(function (jgui) {
    (function (ButtonState) {
        ButtonState[ButtonState["Normal"] = 0] = "Normal";

        ButtonState[ButtonState["Down"] = 1] = "Down";
    })(jgui.ButtonState || (jgui.ButtonState = {}));
    var ButtonState = jgui.ButtonState;
})(jgui || (jgui = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jgui;
(function (jgui) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(width, height, color1, color2) {
            _super.call(this);
            this.moveTo(0, 0);
            this.width = width;
            this.height = height;
            this.enablePointingEvent();
            this.pointDown.handle(this, this.onPointDown);
            this.pointMove.handle(this, this.onPointMove);
            this.pointUp.handle(this, this.onPointUp);
            this.createBg(color1, color2);
            this.state = jgui.ButtonState.Normal;
            this.click = new jg.Trigger();
        }
        Button.prototype._createBg = function (color) {
            var canvas = window.createCanvas(this.width, this.height);
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            var w = this.width;
            var h = this.height;
            var r = 8;
            ctx.arc(r, r, r, -Math.PI, -0.5 * Math.PI, false);
            ctx.arc(w - r, r, r, -0.5 * Math.PI, 0, false);
            ctx.arc(w - r, h - r, r, 0, 0.5 * Math.PI, false);
            ctx.arc(r, h - r, r, 0.5 * Math.PI, Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            return canvas;
        };

        Button.prototype.createBg = function (color1, color2) {
            if (!color1) {
                color1 = jg.JGUtil.createLinearGradient(new jg.Rectangle(this.width / 2, 0, this.width / 2, this.height), ["rgba(240,240,255,1)", "rgba(80, 120, 190, 1)"]);
            }
            if (!color2) {
                color2 = jg.JGUtil.createLinearGradient(new jg.Rectangle(this.width / 2, 0, this.width / 2, this.height), ["rgba(240,240,255,1)", "rgba(240,240,255,1)", "rgba(80, 120, 190, 1)"], [0, 0.1, 1]);
            }
            this.bg1 = this._createBg(color1);
            this.bg2 = this._createBg(color2);
        };

        Button.prototype.onPointDown = function (e) {
            this.stateChange(jgui.ButtonState.Down);
        };

        Button.prototype.onPointMove = function (e) {
            if (this.hitTest(e.point))
                this.stateChange(jgui.ButtonState.Down); else
                this.stateChange(jgui.ButtonState.Normal);
        };

        Button.prototype.onPointUp = function (e) {
            this.stateChange(jgui.ButtonState.Normal);

            if (this.hitTest(e.point))
                this.click.fire(this);
        };

        Button.prototype.stateChange = function (state) {
            if (this.state != state) {
                this.state = state;
                this.updated();
            }
        };

        Button.prototype.draw = function (context) {
            var img;
            img = (this.state == jgui.ButtonState.Normal) ? this.bg1 : this.bg2;
            context.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
        };
        return Button;
    })(jg.E);
    jgui.Button = Button;
})(jgui || (jgui = {}));
var jgui;
(function (jgui) {
    var TextButton = (function (_super) {
        __extends(TextButton, _super);
        function TextButton(text, width, height, color1, color2) {
            _super.call(this, width, height, color1, color2);
            this.label = new jg.Label(text);
            this.label.setMaxWidth(this.width);
            this.label.setTextAlign("center");
            this.label.setTextBaseline("middle");
            this.entities = [];
            this.append(this.label);
            this.label.moveTo(this.width / 2, this.height / 2);
        }
        TextButton.prototype.getText = function () {
            return this.label.text;
        };
        TextButton.prototype.setText = function (text) {
            this.label.setText(text);
        };

        TextButton.prototype.stateChange = function (state) {
            if (this.state != state) {
                if (this.state == jgui.ButtonState.Down) {
                    this.label.y -= 2;
                } else {
                    this.label.y += 2;
                }
                _super.prototype.stateChange.call(this, state);
            }
        };
        return TextButton;
    })(jgui.Button);
    jgui.TextButton = TextButton;
})(jgui || (jgui = {}));
var jgui;
(function (jgui) {
    var Focus = (function (_super) {
        __extends(Focus, _super);
        function Focus() {
            _super.call(this);
            this.disableTransform = true;
            this.color = "#ffff00";
        }
        Focus.prototype.focus = function (target) {
            this.target = target;
        };

        Focus.prototype.draw = function (context) {
            if (!this.target)
                return;
            context.translate(this.target.x, this.target.y);
            this.scene.game.renderer.useDrawOption(this.target, context);
            context.beginPath();
            context.strokeStyle = this.color;
            context.lineWidth = 3;
            context.rect(0, 0, this.target.width, this.target.height);
            context.stroke();
        };
        return Focus;
    })(jg.E);
    jgui.Focus = Focus;
})(jgui || (jgui = {}));
var jgui;
(function (jgui) {
    var FocusManager = (function () {
        function FocusManager(game) {
            this.entities = [];
            this.game = game;
            this.selected = new jg.Trigger();
        }
        FocusManager.prototype.addEntity = function () {
            var e = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                e[_i] = arguments[_i + 0];
            }
            for (var i = 0; i < e.length; i++)
                this.entities.push(e[i]);
        };

        FocusManager.prototype.removeEntity = function () {
            var e = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                e[_i] = arguments[_i + 0];
            }
            var entities = [];
            for (var i = 0, j; i < this.entities.length; i++) {
                for (j = 0; j < e.length; j++) {
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
                    this.focusIndex = -1; else
                    this.focusIndex = 0;
                this.updateFocus();
            }
        };

        FocusManager.prototype.clearEntity = function () {
            this.entities = [];
        };

        FocusManager.prototype.setFocus = function (e) {
            for (var i = 0; i < this.entities.length; i++) {
                if (e == this.entities[i]) {
                    this.focusIndex = i;
                    this.updateFocus();
                    break;
                }
            }
        };

        FocusManager.prototype.updateFocus = function () {
            if (this.focusIndex == -1)
                delete this.focus.target; else {
                this.focus.target = this.entities[this.focusIndex];
                this.focus.updated();
            }
        };

        FocusManager.prototype.start = function (layer) {
            this.game.keyDown.handle(this, this.onKeyDown);
            this.focus = new jgui.Focus();
            if (layer)
                layer.append(this.focus); else
                this.game.scene.append(this.focus);
            this.focusIndex = -1;
            this.updateFocus();
        };

        FocusManager.prototype.end = function () {
            this.game.keyDown.remove(this, this.onKeyDown);
            this.focus.remove();
        };

        FocusManager.prototype.onKeyDown = function (e) {
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
        };
        return FocusManager;
    })();
    jgui.FocusManager = FocusManager;
})(jgui || (jgui = {}));
