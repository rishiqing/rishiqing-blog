#! /bin/bash
# 用于将官网项目的公用css文件复制过来
rootPath='d:/nginx-1.6.0/html/webpage/';
[ "$1" ] && rootPath=$1;
copyCss () {
  echo "复制public.min.css文件中...";
  rm -rf "./content/themes/test-zh/assets/css/public.min.css";
  cp "${rootPath}dist/css/public.min.css" "./content/themes/test-zh/assets/css/public.min.css";
  # 下面的语句会吃掉压缩后的引号o(╯□╰)o
  # cat "${rootPath}dist/css/public.min.css" | xargs echo > "./content/themes/test-zh/assets/css/public.min.css"
  echo "public.min.css文件复制完成";
}

copyJs () {
  echo "复制login.min.js文件中...";
  # cd ./content/themes/test-zh/assets/js;
  rm -rf "./content/themes/test-zh/assets/js/login.min.js";
  cp "${rootPath}dist/js/login.min.js" "./content/themes/test-zh/assets/js/";
  # 下面的语句会吃掉压缩后的引号o(╯□╰)o
  # cat "${rootPath}dist/js/login.min.js" | xargs echo > "./content/themes/test-zh/assets/js/login.min.js"
  echo "login.min.js复制完成";
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
