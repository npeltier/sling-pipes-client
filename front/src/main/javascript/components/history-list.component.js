angular.module('pipesApp').
		component('historyList',{
            template:'<ul class="nav nav-sidebar">'+
                '<li ng-repeat="pipe in $ctrl.pipes">'+
                '<a class="active" href="{{pipe.path}}.html">{{pipe.name}}</a></li>'+
            '</ul>',
		controller:function historyController($http){
              var self = this;
              $http.get('/etc/pipes/history.json').then(function(response) {
                self.pipes = response.data;
              });
		}
});
