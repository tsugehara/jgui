var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jgui;
(function (jgui) {
    (function (ButtonState) {
        ButtonState._map = [];
        ButtonState._map[0] = "Normal";
        ButtonState.Normal = 0;
        ButtonState._map[1] = "Down";
        ButtonState.Down = 1;
    })(jgui.ButtonState || (jgui.ButtonState = {}));
    var ButtonState = jgui.ButtonState;
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
            this.state = ButtonState.Normal;
            this.click = new Trigger();
        }
        Button.prototype.focus = function () {
        };
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
            if(!color1) {
                color1 = JGUtil.createLinearGradient(new Rectangle(this.width / 2, 0, this.width / 2, this.height), [
                    "rgba(240,240,255,1)", 
                    "rgba(80, 120, 190, 1)"
                ]);
            }
            if(!color2) {
                color2 = JGUtil.createLinearGradient(new Rectangle(this.width / 2, 0, this.width / 2, this.height), [
                    "rgba(240,240,255,1)", 
                    "rgba(240,240,255,1)", 
                    "rgba(80, 120, 190, 1)"
                ], [
                    0, 
                    0.1, 
                    1
                ]);
            }
            this.bg1 = this._createBg(color1);
            this.bg2 = this._createBg(color2);
        };
        Button.prototype.onPointDown = function (e) {
            this.stateChange(ButtonState.Down);
        };
        Button.prototype.onPointMove = function (e) {
            if(this.hitTest(e.point)) {
                this.stateChange(ButtonState.Down);
            } else {
                this.stateChange(ButtonState.Normal);
            }
        };
        Button.prototype.onPointUp = function (e) {
            this.stateChange(ButtonState.Normal);
            if(this.hitTest(e.point)) {
                this.click.fire();
            }
        };
        Button.prototype.stateChange = function (state) {
            if(this.state != state) {
                this.state = state;
                this.updated();
            }
        };
        Button.prototype.draw = function (context) {
            var img;
            img = (this.state == ButtonState.Normal) ? this.bg1 : this.bg2;
            context.drawImage(img, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
        };
        return Button;
    })(E);
    jgui.Button = Button;    
    var TextButton = (function (_super) {
        __extends(TextButton, _super);
        function TextButton(text, width, height, color1, color2) {
                _super.call(this, width, height, color1, color2);
            this.label = new Label(text);
            this.label.setMaxWidth(this.width);
            this.label.setTextAlign("center");
            this.label.setTextBaseline("middle");
            this.entities = new Array();
            this.append(this.label);
            this.label.moveTo(this.width / 2, this.height / 2);
        }
        TextButton.prototype.stateChange = function (state) {
            if(this.state != state) {
                if(this.state == ButtonState.Down) {
                    this.label.y -= 2;
                } else {
                    this.label.y += 2;
                }
                _super.prototype.stateChange.call(this, state);
            }
        };
        return TextButton;
    })(Button);
    jgui.TextButton = TextButton;    
})(jgui || (jgui = {}));
