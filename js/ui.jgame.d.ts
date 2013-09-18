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
    interface ISelfFocusControl extends jg.E {
        setFocusEntities(fm: FocusManager);
    }
    class FocusManager {
        public entities: jg.E[];
        public game: jg.Game;
        public focus: jgui.Focus;
        public focusIndex: number;
        public selected: jg.Trigger;
        public changed: jg.Trigger;
        public current: jg.E;
        constructor(game: jg.Game);
        public addEntity(...e: jg.E[]): void;
        public removeEntity(...e: jg.E[]): void;
        public clearEntity(): void;
        public setFocus(e: jg.E): void;
        public updateFocus(): void;
        public start(focus?: jgui.Focus): void;
        public end(): void;
        public onKeyDown(e: jg.InputKeyboardEvent): void;
    }
}
declare module jgui {
    class Arrow extends jgui.Button {
        public _createBg(color: any): HTMLCanvasElement;
        public draw(context: CanvasRenderingContext2D): void;
    }
    class DownArrow extends Arrow {
        public _createBg(color: any): HTMLCanvasElement;
        public draw(context: CanvasRenderingContext2D): void;
    }
    class UpArrow extends Arrow {
    }
    class LeftArrow extends Arrow {
        public _createBg(color: any): HTMLCanvasElement;
        public draw(context: CanvasRenderingContext2D): void;
    }
    class RightArrow extends Arrow {
        public _createBg(color: any): HTMLCanvasElement;
        public draw(context: CanvasRenderingContext2D): void;
    }
}
declare module jgui {
    class BorderLabel extends jg.Label {
        public border_color: any;
        public border: HTMLCanvasElement;
        public padding: jg.Rectangle;
        public background: any;
        public fix_width: number;
        constructor(text?: string, fontSize?: number, fontColor?: string, baseline?: string);
        public setPadding(padding: jg.Rectangle): void;
        public setBackground(background: any): void;
        public setFixWidth(width: number): void;
        public setBorder(color: any, background?: any): void;
        public updateSize(): void;
        public draw(context: CanvasRenderingContext2D): void;
    }
}
declare module jgui {
    class Spinner extends jg.E implements jgui.ISelfFocusControl {
        public up_arrow: jgui.Arrow;
        public down_arrow: jgui.Arrow;
        public text_box: jgui.BorderLabel;
        public changed: jg.Trigger;
        public step: number;
        public label_focus: boolean;
        public arrow_height: number;
        public text_align: string;
        constructor(width: number, height: number);
        public build(): void;
        public setFocusEntities(fm: jgui.FocusManager): void;
        public getValue(): number;
        public setValue(value: number): void;
        public onUp(): void;
        public onDown(): void;
    }
}
declare module jgui {
    class ListBox extends jg.E {
        public row_height: number;
        public layer: jg.Layer;
        public padding: jg.Rectangle;
        public focus_manager: jgui.FocusManager;
        public bg: any;
        public up_scroll_button: jgui.Arrow;
        public down_scroll_button: jgui.Arrow;
        public inner_focus: number;
        public pointing_entity: jg.E;
        constructor(scene: jg.Scene, width: number, height: number, row_height?: number);
        public onPointDown(e: jg.InputPointEvent): void;
        public onPointMove(e: jg.InputPointEvent): void;
        public onPointUp(e: jg.InputPointEvent): void;
        public updateScrollStatus(): boolean;
        public setFocusEntities(fm: jgui.FocusManager): void;
        public onUp(): void;
        public onDown(): void;
        public onFocusChanged(e: any): void;
        public findItem(entity: jg.E): number;
        public moveToLeft(entity: jg.E): void;
        public moveToCenter(entity: jg.E): void;
        public moveToRight(entity: jg.E): void;
        public addItem(entity: jg.E, manual_refresh?: boolean): void;
        public setBg(bg: any): void;
        public getVisibleHeight(): number;
        public draw(context: CanvasRenderingContext2D): void;
        public destroy(): void;
    }
}
