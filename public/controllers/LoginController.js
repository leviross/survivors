function LoginController($http, $rootScope, UserService, $location){

	var self = this;
	this.ShowResetPass = false;

	function ClearForm(){
		self.LoginForm.$setPristine();
    	self.Email = "";
    	self.Password = "";
	}


	this.Login = function(){

		if(this.ShowResetPass){ return this.ResetPassword(); }

        var LoginData = {Email: this.Email, Password: this.Password};
        var url = 'http://' + location.host;

        return $http.post('/api/login', LoginData)
			.then(function(retval){

				if(retval.data.Login){
					alertify.notify('Login Successfull!', 'success', 5, function(){});	
					UserService.PutLoggedInUser(retval.data.User, retval.data.Token);

					$rootScope.$broadcast('UserLoggedIn', retval.data.User);
					$location.path('/');
				}else{
					alertify.notify('Incorrect Credentials, try again', 'error', 5, function(){});
					ClearForm();
					$('#Email').focus();
				}

			}, function(err){
				console.log(err);
				alertify.notify('Connection error, try again', 'error', 5, function(){});	
			});
        
    }

    this.Cancel = function(){ 
    	if(this.ShowResetPass){
    		this.ShowResetPass = false;
    	}else{
    		$location.path('/');
    	}
    }

    this.ShowResetPassword = function(){
    	this.ShowResetPass = true;
    }

    this.ResetPassword = function(){
    	UserService.ResetPassword(this.Email, function(result){
            if(result.Error){
                alertify.notify('That email does not exist in our system', 'error', 5, function(){});   
            }else{
                alertify.notify('Check your email for your password reset link', 'warning', 5, function(){});   
                self.ShowResetPass = false; 
            }
    		ClearForm();
    	});
    }

}

LoginController.$inject = ['$http', '$rootScope', 'UserService', '$location'];

app.controller('LoginController', LoginController);