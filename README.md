# 给维护者的话：
在dist文件的tilemap.esm.js
我已export default

dist：
    cover.png 是封面
    icon.png 是图标
    info.json 是信息
    demo.sb3 是用这个扩展的实例
    tilemap.esm.js 扩展文件

# 打包有多种模式
在main.js修改，现在是GANDI_PRODUCT
```js
const MODE = {
    GANDI_DEV: 0,
    TURBOWARP: 1,
    GANDI_PRODUCT: 2
}
```