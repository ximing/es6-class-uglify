## es6-class-uglify

用来压缩 ES6 classes 中属性名和方法名的包

## 为什么开发这个包

目前如 uglify-es/terser 这类通用混淆工具不能压缩 es6 类字段和成员函数。因为它们不能跟踪在对象上调用方法时的类。

## 使用限制

因为必须对所有的代码进行分析才能知道是否可以安全的压缩类的属性和方法，所以使用此包必须借用`rollup`之类的打包工具将代码打包到一个文件后完整分析

## 使用方法

```javascript
import { ES6ClassUglify } from 'es6-class-uglify';
const es6ClassUglify = new ES6ClassUglify();
es6ClassUglify.minify(code);
```

## API

### 参数

| 名称 | 类型                       | 描述                                                                                                 |
| ---- | :------------------------- | ---------------------------------------------------------------------------------------------------- |
| test | (name: string) => boolean; | 确认哪些属性/方法名是需要被压缩的，默认：`(name: string) => /^_\w+$/.test(name)`，及\_开头的会被压缩 |
