// Regexps involved with splitting words in various case formats.
const SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
const SPLIT_UPPER_UPPER_RE = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu;
// Used to iterate over the initial split result and separate numbers.
const SPLIT_SEPARATE_NUMBER_RE = /(\d)\p{Ll}|(\p{L})\d/u;
// Regexp involved with stripping non-word characters from the result.
const DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;
// The replacement value for splits.
const SPLIT_REPLACE_VALUE = "$1\0$2";
// The default characters to keep after transforming case.
const DEFAULT_PREFIX_SUFFIX_CHARACTERS = "";
/**
 * Split any cased input strings into an array of words.
 */
function split(value) {
    let result = value.trim();
    result = result
        .replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE)
        .replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);
    result = result.replace(DEFAULT_STRIP_REGEXP, "\0");
    let start = 0;
    let end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    if (start === end)
        return [];
    while (result.charAt(end - 1) === "\0")
        end--;
    return result.slice(start, end).split(/\0/g);
}
/**
 * Split the input string into an array of words, separating numbers.
 */
function splitSeparateNumbers(value) {
    const words = split(value);
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const match = SPLIT_SEPARATE_NUMBER_RE.exec(word);
        if (match) {
            const offset = match.index + (match[1] ?? match[2]).length;
            words.splice(i, 1, word.slice(0, offset), word.slice(offset));
        }
    }
    return words;
}
/**
 * Convert a string to space separated lower case (`foo bar`).
 */
function noCase(input, options) {
    const [prefix, words, suffix] = splitPrefixSuffix(input, options);
    return (prefix +
        words.map(lowerFactory(options?.locale)).join(options?.delimiter ?? " ") +
        suffix);
}
/**
 * Convert a string to kebab case (`foo-bar`).
 */
function kebabCase(input, options) {
    return noCase(input, { delimiter: "-", ...options });
}
function lowerFactory(locale) {
    return locale === false
        ? (input) => input.toLowerCase()
        : (input) => input.toLocaleLowerCase(locale);
}
function splitPrefixSuffix(input, options = {}) {
    const splitFn = options.split ?? (options.separateNumbers ? splitSeparateNumbers : split);
    const prefixCharacters = options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
    const suffixCharacters = options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
    let prefixIndex = 0;
    let suffixIndex = input.length;
    while (prefixIndex < input.length) {
        const char = input.charAt(prefixIndex);
        if (!prefixCharacters.includes(char))
            break;
        prefixIndex++;
    }
    while (suffixIndex > prefixIndex) {
        const index = suffixIndex - 1;
        const char = input.charAt(index);
        if (!suffixCharacters.includes(char))
            break;
        suffixIndex = index;
    }
    return [
        input.slice(0, prefixIndex),
        splitFn(input.slice(prefixIndex, suffixIndex)),
        input.slice(suffixIndex),
    ];
}

const defaultOptions = {
    repeat: "no-repeat",
    size: "contain"
};
const prepareStyles = (url, options) => new Promise((resolve) => {
    const { repeat, position, size, ...res } = { ...defaultOptions, ...options };
    const styles = [
        `background-repeat: ${repeat}`,
        "font-size: 0"
    ];
    position?.length && styles.push(`background-position: ${position.join(" ")}`);
    size && styles.push(`background-size: ${size}`);
    Object.entries(res).forEach(([k, v]) => {
        styles.push([kebabCase(k), v].join(": "));
    });
    resolve(styles);
});
var index = {
    ...console,
    /**
     * Attention!: limited by CORS policy!
     * @param url
     * @param options
     */
    image(url, options) {
        prepareStyles(url, options).then(styles => {
            const x = new XMLHttpRequest();
            x.responseType = "blob";
            x.open("get", url);
            x.send();
            x.onload = () => {
                const fr = new FileReader();
                fr.onload = () => {
                    let { width, height } = { ...defaultOptions, ...options };
                    const img = new Image();
                    img.src = fr.result;
                    img.onload = () => {
                        const iw = img.width, ih = img.height;
                        if (!iw || !ih)
                            throw new Error(`Invalid image: Image size invalid (${iw}x${ih})`);
                        // 指定了尺寸，那么要根据这个尺寸进行实际尺寸的约束
                        if (width || height) {
                            // 仅指定宽度
                            if (!height) {
                                // 比例计算
                                height = width * (ih / iw);
                            }
                            // 仅指定高度
                            else if (!width) {
                                width = height * (iw / ih);
                            }
                            // 宽高同时指定
                            else ;
                        }
                        // 由图像自行驱动
                        else {
                            width = iw;
                            height = ih;
                        }
                        styles.push(...[
                            `background-image: url(${fr.result})`,
                            `padding: ${height / 2}px ${width / 2}px`,
                        ]);
                        // console.log(styles)
                        console.log("%c ", styles.join(";"));
                    };
                    img.onerror = e => console.error(e);
                };
                fr.readAsDataURL(x.response);
            };
        });
    }
};

export { index as default };
