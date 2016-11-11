#! /bin/bash
# 用于将官网项目的公用css文件复制过来
rootPath='d:/nginx-1.6.0/html/webpage/';
themePath='./content/themes/test-zh/';
[ "$1" ] && rootPath=$1;
doCopy () {
  echo "";
  filename=$(basename ${1});
  echo "复制${filename}文件中...";
  rm -rf "${themePath}$1" 2> /dev/null;
  # echo "删除" "${themePath}$1";
  cp "${rootPath}$1" "${themePath}$2";
  # echo "移动" "${rootPath}$1" "到" "${themePath}$2";
  echo "复制${filename}完成";
  echo "";
}
copyCss () {
  doCopy "dist/css/public.min.css" "assets/css/public.min.css";
}

copyJs () {
  doCopy "dist/js/lib.min.js" "assets/js/lib.min.js";
  doCopy "dist/js/login.min.js" "assets/js/login.min.js";
}
copyHtml () {
  echo "复制头部、底部文件中...";
  cd "./content/themes/test-zh/partials/";
  # 头部文件因为logo路径的问题， 不能够直接拷过来
  rm -rf footer.hbs;
  cp ${rootPath}public/footerList2.php ./footer.hbs;
  echo "头部、底部html复制完成";
}
copyCss;
copyJs;
copyHtml;
gulp cssmin;
gulp scripts;
