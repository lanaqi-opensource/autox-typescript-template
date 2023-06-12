declare namespace floaty {
    function window(layout: any): FloatyWindow;
    function rawWindow(layout: any): FloatyRawWindow;
    function closeAll(): void;
    function checkPermission(): boolean;
    function requestPermission(): void;
    interface FloatyWindow {
        setAdjustEnabled(enabled: boolean): void;
        setPosition(x: number, y: number): void;
        getX(): number;
        getY(): number;
        setSize(width: number, height: number): void;
        getWidht(): number;
        getHeight(): number;
        close(): void;
        exitOnClose(): void;
    }
    interface FloatyRawWindow {
        setTouchable(enabled: boolean): void;
        setPosition(x: number, y: number): void;
        getX(): number;
        getY(): number;
        setSize(width: number, height: number): void;
        getWidht(): number;
        getHeight(): number;
        close(): void;
        exitOnClose(): void;
    }
}
