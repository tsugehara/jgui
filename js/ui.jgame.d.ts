declare module jgui {
    enum ButtonState {
        Normal,
        Down,
    }
}
declare module jgui {
    class Button extends jg.E {
        public bg1: HTMLCanvasElement;
        public bg2: HTMLCanvasElement;
        public state: jgui.ButtonState;
        public click: jg.Trigger;
        constructor(width: number, height: number, color1?: any, color2?: any);
        public _createBg(color: any): HTMLCanvasElement;
        public createBg(color1?: any, color2?: any): void;
        public onPointDown(e: jg.InputPointEvent): void;
        public onPointMove(e: jg.InputPointEvent): void;
        public onPointUp(e: jg.InputPointEvent): void;
        public stateChange(state: jgui.ButtonState): void;
        public draw(context: CanvasRenderingContext2D): void;
    }
}
declare module jgui {
    class TextButton extends jgui.Button {
        public label: jg.Label;
        constructor(text: string, width: number, height: number, color1?: any, color2?: any);
        public getText(): string;
        public setText(text: string): void;
        public stateChange(state: jgui.ButtonState): void;
    }
}
declare module jgui {
    class Focus extends jg.E {
        public target: jg.E;
        public color: any;
        constructor();
        public focus(target: jg.E): void;
        public draw(context: CanvasRenderingContext2D): void;
    }
}
declare module jgui {
    class FocusManager {
        public entities: jg.E[];
        public game: jg.Game;
        public focus: jgui.Focus;
        public focusIndex: number;
        public selected: jg.Trigger;
        constructor(game: jg.Game);
        public addEntity(...e: jg.E[]): void;
        public removeEntity(...e: jg.E[]): void;
        public clearEntity(): void;
        public setFocus(e: jg.E): void;
        public updateFocus(): void;
        public start(layer?: jg.Layer): void;
        public end(): void;
        public onKeyDown(e: jg.InputKeyboardEvent): void;
    }
}
