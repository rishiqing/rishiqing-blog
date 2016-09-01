function setPlaceHolder(obj,content){
  // var $search = $('#search');
      obj.val(content);
      obj.bind('focus',function () {
        if($(this).val()===content){
          $(this).val('');
        }
      });
      obj.bind('blur',function () {
        if($(this).val()===''){
          $(this).val(content);
        }
      });
}