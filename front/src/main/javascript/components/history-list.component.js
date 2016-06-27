angular.module('pipesApp').
		component('historyList',{
			template:
						'<ul class="nav nav-sidebar">'+
							'<li ng-repeat="date in $ctrl.pipes">'+
							'<a class="active" href="#">{{date.day}}</a>'+'</li>'+
						'</ul>'
			,
		controller:function historyController(){
			this.pipes=[
			{
				day:'2016-04-02'
			},
			{
				day:'2016-05-03'
			}

			];
		}

		});
