angular.
module('pipesApp').
	component('bookList',{
		template:'<ul class="nav nav-sidebar">'+
                            '<li ng-repeat="pipe in $ctrl.pipes">'+
                            '<a class="active" href="{{pipe.path}}.html">{{pipe.name}}</a></li>'+
                        '</ul>',
		controller:function libraryController($http){
              var self = this;
              $http.get('/etc/sling/pipes/library.json').then(function(response){
                self.pipes = response.data;
              });
    	}

    });