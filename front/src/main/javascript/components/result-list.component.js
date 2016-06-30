angular.
module('pipesApp').
    component('resultList', {
                template: '<div class="panel-body">'+
                		'<p>total:{{$ctrl.pipes.size}}</p></div>'+
                         '<ul class ="list-group">'+
                          '<li class="list-group-item" ng-repeat="result in $ctrl.pipes.items">{{result}}</li>'+
                       '</ul>',
            controller: function resultController($http){
                    var self=this,
                        path = document.location.pathname,
                        pipe = path.substring(0, path.indexOf(".html")) + ".json";
                     $http.get(pipe).then(function(response){
                        self.pipes = response.data;
                     });
             }
     });