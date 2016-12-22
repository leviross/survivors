app.controller('QuickViewController', ['$scope', '$rootScope', function($scope, $rootScope){

	$('#product-quick-view-modal').modal({show: false});

	$scope.$on('OpenQuickViewModal', function(event){
		$('#product-quick-view-modal').modal('show');
	});

	


}]);