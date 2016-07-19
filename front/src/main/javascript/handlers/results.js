$('.execute').click(function(){
Pipes.emptyResultsList();
  $.ajax({
     url: Pipes.retrievePipePath() + ".json",
     type:'post',
     dataType:'json',
     success: function (data) {
         Pipes.handleResults(data);
     }
  });
});
