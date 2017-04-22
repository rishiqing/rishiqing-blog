#! /bin/bash
# 用于将官网项目的公用css文件复制过来
#rootPath='d:/nginx-1.6.0/html/webpage/';
rootPath='/Users/Jason/project/company/webpage/';
themePath='./content/themes/test-zh/';

sourceJsPath='dist/blog/js/';
sourceCssPath='dist/blog/css/';

distJsPath='assets/js/';
distCssPath='assets/css/';

# 需要复制的js文件
# jsFile="lib.min.js login.min.js";
jsFile="lib.js login.js";

[ "$1" ] && rootPath=$1;
doCopy () {
  echo "";
  local filename=$(basename ${1});
  echo "复制${filename}文件中...";
  cd "$themePath";
  rm -rf "$1" 2> /dev/null;
  # echo "删除" "$1";
  cp "${rootPath}$1" "$2";
  # echo "移动" "${rootPath}$1" "到" "$2";
  echo "复制${filename}完成";
  echo "";
  cd -;
}
copyCss () {
  doCopy "${sourceCssPath}public.css" "${distCssPath}public.min.css";
}

copyJs () {
  # doCopy "${sourceJsPath}${jsFile[]}" "${distJsPath}${file}";
  doCopy "${sourceJsPath}lib.js" "${distJsPath}${file}";
  doCopy "${sourceJsPath}login.js" "${distJsPath}${file}";

  # for file in $jsFile; do
  #   doCopy "${sourceJsPath}${file}" "${distJsPath}${file}";
  # done;
}
copyHtml () {
  echo "复制头部、底部文件中...";
  cd "./content/themes/test-zh/partials/";
  rm footer.hbs header-nav.hbs 2> /dev/null;
  cp ${rootPath}public/footerList2.php ./footer.hbs;
  cp ${rootPath}public/header-common.php ./header-nav.hbs;
  echo "头部、底部html复制完成";
  cd -;
}
copyCss;
copyJs;
copyHtml;
gulp cssmin;
gulp scripts;
