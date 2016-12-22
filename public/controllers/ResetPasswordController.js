app.controller('ResetPasswordController', ['$scope', 'UserService', '$routeParams', '$location', function($scope, UserService, $routeParams, $location){

	var routeParams = $routeParams;

	if(routeParams.id){
		routeParams.user = {_id: routeParams.id, Email: routeParams.email};
		UserService.PutLoggedInUser(routeParams.user, routeParams.token);
		$location.url('/reset-password');
	}else{
		$scope.User = UserService.GetLoggedInUser();
	}
	

	$scope.ResetPassword = function(){
		var userObj = UserService.GetLoggedInUser();
		userObj.Password = $scope.Password;
		UserService.ChangeUserPassword(userObj, function(result){
			if(result.data.name == "TokenExpiredError"){
				alertify.notify('Link expired, please request a new link.', 'error', 5, function(){});
				$location.path('/login');
			}else if(!result.data.PasswordUpdated){
				alertify.notify('That password was used already, try again.', 'error', 5, function(){});
				ClearForm();
				$('#Password').focus();
			}else{
				alertify.notify('Password changed, please login.', 'success', 5, function(){});
				$location.path('/login');	
			}
			
		});

	}

	$scope.Cancel = function() {$location.path('/login'); }

	function ClearForm(){
		$scope.Password = "";
		$scope.Password2 = "";
		$scope.ResetPasswordForm.$setPristine();
	}


}]);