export declare enum BackgroundRepeat {
    noRepeat = "no-repeat",
    repeat = "repeat",
    repeatX = "repeat-x",
    repeatY = "repeat-y",
    round = "round",
    space = "space"
}
type TBackgroundPositionItem = "bottom" | "center" | "left" | "right" | "top" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | any;
type TBackgroundSize = "auto" | "contain" | "cover" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | string;
type TOption = {
    width?: number;
    height?: number;
    repeat?: BackgroundRepeat;
    position?: TBackgroundPositionItem[];
    size?: TBackgroundSize;
    [index: string]: any;
};
declare const _default: Console & {
    image: (url: string, options?: TOption) => void;
};
export default _default;
