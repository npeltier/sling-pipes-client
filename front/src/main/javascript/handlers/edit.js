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

$('.editName').on('focusout',function(){
    var path = $(this).parents(".subpipe").data("path"),
    pathRepertory=path.substring(0,path.lastIndexOf("/")),
    value=$(this).text();
    $.ajax({
      url : path,
      type:'post',
      data: {':operation':'move',
             ':replace': 'true',
             ':dest': pathRepertory +"/"+ value},
      success: function(){
                location.reload();
             }
    });
});


$('.typeInput').on('focusin',function(){
    $(this).hide();
    $(this).next().children().show();
    $(this).next().children().focus();
});

$('.typeSelect').on('focusout',function(){
    $(this).parent().prev().show();
    $(this).hide();
});

$("select#inTypeSelect").on('change',function(){
    var path =$(this).parents('.subpipeContent').data('path'),
            property = $(this).parent().prev().data("property"),
            value = $(this).val(),
            data = {};
        data[property] = value;
        $.ajax({
             url: path,
             type:'post',
             data: data,
             success: function(){
                 location.reload();
               }
        });
});

$('.chevronUp').click(function(){
    var current=$(this).parent().children('.subpipeContent').data('path'),
        prev=$(this).parent().prev().children('.subpipeContent').data('path'),
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

$('.chevronDown').click(function(){
    var current=$(this).parent().children('.subpipeContent').data('path'),
        next=$(this).parent().next().children('.subpipeContent').data("path"),
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
   var inputT=$('#select').val();
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

$('.bttRemove').click(function(){
    var current=$(this).next().data("path");
    $.ajax({
        url:current,
        type:'post',
        data:{":operation":"delete"},
        success: function(){
                location.reload();
        }
    });
});
