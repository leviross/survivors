app.directive('navSelect', function(){
	return {
		restrict: 'EA',
		replace: true,
		link: function(scope, elem, attr){
			console.log("Elements:\n", elem);
		}
	}
})