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
        public focus(): void;
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
}
