$('.edit').on('focusout',function(){
    var path =$(this).parents(".subpipe").data("path"),
        property = $(this).data("property"),
        value = $(this).text(),
        data = {};
    data[property] = value;
    $.ajax({
         url: path,
         type:'post',
         data: data,
         success: function(){
           }
    });
});

$('.chvL').click(function(){
    var current=$(this).parents('.subpipe').data("path"),
     prev=$(this).parents(".subpipe").prev().data("path"),
     prevName=prev.substring(prev.lastIndexOf("/")+1);
    $.ajax({
        url: current,
        type:'post',
        data: {":order":"before "+prevName},
        success: function(){
             location.reload();
        }
    });
});

$('.chvR').click(function(){
    var current=$(this).parents('.subpipe').data("path"),
         next=$(this).parents(".subpipe").next().data("path"),
         nextName=next.substring(next.lastIndexOf("/")+1);
        $.ajax({
            url: current,
            type:'post',
            data: {":order":"after "+nextName},
            success: function(){
                 location.reload();
            }
        });
  });

$('.saveSubPipe').click (function(){
   var inputN=$('#inputName').val();
   var inputT=$('#inputType').val();
   path=document.location.pathname.substring(0, path.indexOf(".html"));
    $.ajax({
        url:path+"/conf/"+inputN,
        type: 'post',
        data:{"sling:resourceType":inputT},
        success: function(){
            location.reload();
        }
    });
});
