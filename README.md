# console.image

## usage

```ts
import console from "@cynario/console.image"

// console.image(url, options?)

// render image with it's default size
console.image("http://127.0.0.1/x.png")

// render image with 198px as assigned width, height will be auto computed based on size ratio 
console.image("http://127.0.0.1/x.png", {width: 198})

// in vue, you can use it like this way
console.image(require("@/assets/x.png"))

// of course, you can still use raw functions of console
console.log("hello")
```

## example

See [example](https://noah227.github.io/console.image/).
