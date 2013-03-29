module jgui {
    enum ButtonState {
        Normal,
        Down,
    }
    class Button extends E {
        public bg1: HTMLCanvasElement;
        public bg2: HTMLCanvasElement;
        public state: ButtonState;
        public click: Trigger;
        constructor(width: number, height: number, color1?: any, color2?: any);
        public _createBg(color: any): HTMLCanvasElement;
        public createBg(color1?: any, color2?: any): void;
        public onPointDown(e: InputPointEvent): void;
        public onPointMove(e: InputPointEvent): void;
        public onPointUp(e: InputPointEvent): void;
        public stateChange(state: ButtonState): void;
        public draw(context: CanvasRenderingContext2D): void;
    }
    class TextButton extends Button {
        public label: Label;
        constructor(text: string, width: number, height: number, color1?: any, color2?: any);
        public stateChange(state: ButtonState): void;
    }
    class Focus extends E {
        public target: E;
        public color: any;
        constructor();
        public focus(target: E): void;
        public draw(context: CanvasRenderingContext2D): void;
    }
    class FocusManager {
        public entities: E[];
        public game: Game;
        public focus: Focus;
        public focusIndex: number;
        public selected: Trigger;
        constructor(game: Game);
        public addEntity(...e: E[]): void;
        public removeEntity(...e: E[]): void;
        public clearEntity(): void;
        public setFocus(e: E): void;
        public updateFocus(): void;
        public start(): void;
        public end(): void;
        public onKeyDown(e: InputKeyboardEvent): void;
    }
}
