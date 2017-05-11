# 日事清博客

### [链接](https://www.rishiqing.com/blog)

### 开始
**注意： ghost只支持4.2这个版本的nodejs, 所以需要考虑使用[nvm](https://github.com/creationix/nvm)安装该版本。**

* `npm start`
  开启服务器
* `gulp`
  更新内容（修改`html`、`css`、`js`文件）

项目（仅指页面结构和样式一类）使用`gulp`进行构建， 所以在进行修改之前需要先全局安装gulp, 然后在项目目录下运行`gulp`。 更改html, css, js的时候， 只需要更改[./content/themes/test-zh](./content/themes/test-zh)下的东西就行了。 test-zh为当前使用的主题名字，至于为什么是这个名字， o(╯□╰)o ， 历史原因。

[博客前端开发文档](./content/themes/test-zh/README.md)

### 主题目录结构

```bash
.
│   README.MD
│
├───css
│       app.css           # 这个文件由scss/index.scss生成
│       public.min.css    # 这个文件直接使用脚本拷贝过来
│       screen.css
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
│       init.js        # 移动设备判断，及菜单下拉框脚本
│       lib.min.js     # 这两个文件直接使用脚本拷贝过来
│       login.min.js   # 这两个文件直接使用脚本拷贝过来
│
└───scss
```
### 注意事项
由于官网与博客是两个独立的工程， 但是也有如下几个公共的地方。

* 头部导航
* 登录框
* 底部网站地图及备案信息
* 公共css
* 公共js

由于每次官网相关内容有变动之后博客的也需要同步更新，所以写了脚本[`cp.sh`](./cp.sh)来进行更新， 只需要运行`bash ./cp.sh`或者`npm run cp`就能够更新该部分内容。

