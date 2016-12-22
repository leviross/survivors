function RegisterController($scope, ValidationService, $http, $location){

	this.CheckFirstName = function(){
		if($scope.FirstName !== ""){
        	$scope.FirstName = ValidationService.Capitalize($scope.FirstName);
		}
    }

    this.CheckLastName = function(){
    	if($scope.LastName !== ""){
        	$scope.LastName = ValidationService.Capitalize($scope.LastName);
    	}
    }

    this.Register = function(){
        var SignUpData = {Email: $scope.Email, FirstName: $scope.FirstName, LastName: $scope.LastName, Password: $scope.Password};

        return $http.post('/api/users', SignUpData)
            .then(function(retval){
                if(retval.data.Created){
	        		alertify.notify('Welcome to Sefira Creative! Please login.', 'success', 5, function(){});
	        		$scope.RegistrationForm.$setPristine();
	    			$location.path('/login');
	        	}else{
	        		alertify.notify('That email already exists, try again.', 'error', 5, function(){});	
	        		$scope.RegistrationForm.$setPristine();
	        		$scope.FirstName = "";
	        		$scope.LastName = "";
	        		$scope.Email = "";
	        		$scope.Password = "";
	        		$scope.Password2 = "";
	        		$('#FirstName').focus();
	        	}
            
            }, function(err){
            	alertify.notify('Connection error, try again', 'error', 5, function(){});
                console.log("Error Registering\n", err);
            });

    }

}

RegisterController.$inject = ['$scope', 'ValidationService', '$http', '$location'];

app.controller('RegisterController', RegisterController);