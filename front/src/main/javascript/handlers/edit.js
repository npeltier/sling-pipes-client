
$('[data-property]').on('focusout',function(){
    var path = $(this).data("path") || $(this).parents(".subpipe").data("path"),
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

var getCurrentPipePath = function(elt){
    return Pipes.getSubpipePath($(elt).parent(".subpipe"));
};

$('.moveup').click(function(){
    var current = getCurrentPipePath(this),
        prev = Pipes.getSubpipePath($(this).parent(".subpipe").prev()),
        prevName = Pipes.getNameFromPath(prev);
    $.ajax({
        url: current,
        type:'post',
        data: {":order":"before " + prevName},
        success: function(){
            location.reload();
        }
    });
});

$('.movedown').click(function(){
    var current = getCurrentPipePath(this),
        next = Pipes.getSubpipePath($(this).parent(".subpipe").next()),
        nextName= Pipes.getNameFromPath(next);
    $.ajax({
        url: current,
        type:'post',
        data: {":order":"after " + nextName},
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

$('.remove').click(function(){
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
