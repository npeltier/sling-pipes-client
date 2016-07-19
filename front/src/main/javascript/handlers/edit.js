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
         console.log("ok");
           }
    });
});

$('.typeInput').on('focusin',function(){
    $(this).parents('.subpipe').children('span').eq(1).children('.typeInput').hide();
    $(this).parents('.subpipe').children('span').eq(1).children('div').children(".typeSelect").show();
    $(this).parents('.subpipe').children('span').eq(1).children('div').children(".typeSelect").focus();
});

$('.typeSelect').on('focusout',function(){
    $(this).parents('.subpipe').children('span').eq(1).children('.typeInput').show();
    $(this).parents('.subpipe').children('span').eq(1).children('div').children(".typeSelect").hide();
});

$("select#inTypeSelect").on('change',function(){
    console.log('on');
    var path =$(this).parents(".subpipe").data("path"),
            property = $(this).parents('.subpipe').children('span').eq(1).children('.typeInput').data("property"),
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
    var current=$(this).parents('.subpipe').data("path");
    $.ajax({
        url:current,
        type:'post',
        data:{":operation":"delete"},
        success: function(){
            location.reload();
        }
    });
})
