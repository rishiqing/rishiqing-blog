# 日事清博客

### [链接](https://www.rishiqing.com/blog)

### 开始

项目（仅指页面结构和样式一类）使用`gulp`进行构建， 所以在进行修改之前需要先全局安装gulp, 然后在项目目录下运行`gulp`。 更改html, css, js的时候， 只需要更改[./content/themes/test-zh](./content/themes/test-zh)下的东西就行了。 test-zh为当前使用的主题名字，至于为什么是这个名字， o(╯□╰)o ， 历史原因。

主题目录结构

```bash
.
│   README.MD
│
├───css
│       app.css           # 这个文件由scss/index.scss生成
│       public.min.css    # 这两个文件直接使用脚本拷贝过来
│       screen.css        # 这两个文件直接使用脚本拷贝过来
│
├───dist
│   ├───css
│   │       index.min.css
│   │
│   └───js
│           all.min.js
│
├───fonts
│
├───js
│       init.js
│       lib.min.js     # 这两个文件直接使用脚本拷贝过来
│       login.min.js   # 这两个文件直接使用脚本拷贝过来
│
└───scss
```
