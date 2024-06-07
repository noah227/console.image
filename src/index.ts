export enum BackgroundRepeat {
	noRepeat = "no-repeat",
	repeat = "repeat",
	repeatX = "repeat-x",
	repeatY = "repeat-y",
	round = "round",
	space = "space"
}

// export enum BackgroundPosition {
// 	bottom = "bottom",
// 	center = "center",
// 	left = "left",
// 	right = "right",
// 	top="top",
// 	inherit="inherit",
// 	initial="initial",
// 	revert = "revert",
// 	revertLayer = "revert-layer",
// 	unset = "unset",
// }
type TBackgroundPositionItem =
	"bottom"
	| "center"
	| "left"
	| "right"
	| "top"
	| "inherit"
	| "initial"
	| "revert"
	| "revert-layer"
	| "unset"
	| any
type TBackgroundSize =
	"auto"
	| "contain"
	| "cover"
	| "inherit"
	| "initial"
	| "revert"
	| "revert-layer"
	| "unset"
	| string

type TOption = {
	width?: number
	height?: number
	repeat: BackgroundRepeat
	position: TBackgroundPositionItem[]
	size: TBackgroundSize
	[index: string]: any
}

const defaultOptions: Partial<TOption> = {
	repeat: BackgroundRepeat.noRepeat,
	size: "contain"
}

const prepareStyles = (url: string, options: TOption): Promise<string[]> => new Promise((resolve, reject) => {
	const {repeat, position, size, ...res} = {...defaultOptions, ...options}
	const styles: string[] = [
		`background-repeat: ${repeat}`,
		"font-size: 0"
	]
	position?.length && styles.push(`background-position: ${position.join(" ")}`)
	size && styles.push(`background-size: ${size}`)
	Object.entries(res).forEach(([k, v]) => {
		styles.push([k, v].join(": "))
	})
	resolve(styles)
})

console = {
	...console,
	/**
	 * Attention!: limited by CORS policy!
	 * @param url
	 * @param options
	 */
	image(url, options) {
		prepareStyles(url, options).then(styles => {
			const x = new XMLHttpRequest()
			x.responseType = "blob"
			x.open("get", url)
			x.send()
			x.onload = () => {
				const fr = new FileReader()
				fr.onload = () => {
					let {width, height} = {...defaultOptions, ...options}
					const img = new Image()
					img.src = fr.result as string
					img.onload = () => {
						const iw = img.width, ih = img.height
						if (!iw || !ih) throw new Error(`Invalid image: Image size invalid (${iw}x${ih})`)
						// 指定了尺寸，那么要根据这个尺寸进行实际尺寸的约束
						if (width || height) {
							// 仅指定宽度
							if (width && !height) {
								// 比例计算
								height = width * (ih / iw)
							}
							// 仅指定高度
							else if (height && !width) {
								width = height * (iw / ih)
							}
							// 宽高同时指定
							else {
								// 不用处理
							}
						}
						// 由图像自行驱动
						else {
							width = iw
							height = ih
						}
						styles.push(...[
							`background-image: url(${fr.result})`,
							`padding: ${height as number / 2}px ${width as number / 2}px`,
						])
						console.log(styles)
						console.log("%c ", styles.join(";"));
					}
					img.onerror = e => console.error(e)
				}
				fr.readAsDataURL(x.response)
			}
		})
	}
} as Console & {
	image: (url: string, options: TOption) => void
}
