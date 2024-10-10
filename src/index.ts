import {kebabCase} from "change-case"

type TBackgroundRepeat = "no-repeat" | "repeat" | "repeat-x" | "repeat-y" | "round" | "space"

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
	repeat?: TBackgroundRepeat
	position?: TBackgroundPositionItem[]
	size?: TBackgroundSize
	[index: string]: any
}

const defaultOptions: Partial<TOption> = {
	repeat: "no-repeat",
	size: "contain"
}

const prepareStyles = (url: string, options?: TOption): Promise<string[]> => new Promise((resolve) => {
	const {repeat, position, size, ...res} = {...defaultOptions, ...options}
	const styles: string[] = [
		`background-repeat: ${repeat}`,
		"font-size: 0"
	]
	position?.length && styles.push(`background-position: ${position.join(" ")}`)
	size && styles.push(`background-size: ${size}`)
	Object.entries(res).forEach(([k, v]) => {
		styles.push([kebabCase(k), v].join(": "))
	})
	resolve(styles)
})

export default {
	...console,
	/**
	 * Attention!: limited by CORS policy!
	 * @param url
	 * @param options
	 * @param callback
	 */
	image(url, options, callback?: Function) {
		return new Promise((resolve, reject) => {
			prepareStyles(url, options).then(styles => {
				fetch(url).then(res => {
					if (!res.ok) reject(new Error("Image load failed!"))
					else {
						res.blob().then(blob => {
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
										if (!height) {
											// 比例计算
											height = (width as number) * (ih / iw)
										}
										// 仅指定高度
										else if (!width) {
											width = (height as number) * (iw / ih)
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
									// console.log(styles)
									console.log("%c ", styles.join(";"));
									callback && callback()
									resolve()
								}
								img.onerror = e => {
									console.error(e)
									reject(e)
								}
							}
							fr.onerror = () => reject(fr.error)
							fr.readAsDataURL(blob)
						}).catch(reject)
					}
				}).catch(reject)
			})
		})
	}

} as Console & {
	image: (url: string, options?: TOption, callback?: Function) => Promise<void>
}

