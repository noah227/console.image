type TBackgroundRepeat = "no-repeat" | "repeat" | "repeat-x" | "repeat-y" | "round" | "space";
type TBackgroundPositionItem = "bottom" | "center" | "left" | "right" | "top" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | any;
type TBackgroundSize = "auto" | "contain" | "cover" | "inherit" | "initial" | "revert" | "revert-layer" | "unset" | string;
type TOption = {
    width?: number;
    height?: number;
    repeat?: TBackgroundRepeat;
    position?: TBackgroundPositionItem[];
    size?: TBackgroundSize;
    [index: string]: any;
};
declare const _default: Console & {
    image: (url: string, options?: TOption) => void;
};
export default _default;
