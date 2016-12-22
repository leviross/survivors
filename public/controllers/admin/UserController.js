function UserController($scope, UserService, ValidationService, $location){

	this.DisplayMode = 'list';
	this.UserTypes = [{id: "1", name: "Admin", value: true}, {id: "2", name: "Non-Admin", value: false}];
	var self = this;
	var currentIndex = null;
	
	this.AllUsers = UserService.GetCachedUsers("UsersArray");

	if(this.AllUsers == null || this.AllUsers == undefined || this.AllUsers == "undefined"){
		UserService.GetAllUsers(function(usersArray){
			self.AllUsers = usersArray;
		});
	}

	this.EditUser	= function(user, index){
		currentIndex = index;
		this.DisplayMode = 'edit';
		this.FirstName = user.FirstName;
		this.LastName = user.LastName;
		this.Email = user.Email;
		this.IsAdmin = user.IsAdmin;
		this._id = user._id;
	}


	this.NewUser = function(){
		this.DisplayMode = 'edit';
		this.FirstName = "";
		this.LastName = "";
		this.Email =  "";
		this.Password1 = "";
		this.Password2 = "";
		this.IsAdmin = "2";
		this._id = null;
		this.ShowChangePassword = true;
	}

	this.CheckFirstName = function(){
		if(this.FirstName != "" && this.FirstName != undefined){
			this.FirstName = ValidationService.Capitalize(this.FirstName);
		}
	}
	this.CheckLastName = function(){
		if(this.LastName != "" && this.LastName != undefined){
			this.LastName = ValidationService.Capitalize(this.LastName);
		}
	}

	this.CreateUser = function (){
		var NewUserObj = {FirstName: this.FirstName, LastName: this.LastName, Email: this.Email, Password: this.Password1, 
			IsAdmin: this.IsAdmin, IsEmployee: true}
		UserService.CreateNewUser(NewUserObj, function(result){
			if(result.Error){
				MyAlert('Login timed out, please login again.', 'error', 5);
				$location.path('/login');
			}else{
				MyAlert('User: ' + result.User.FirstName + ' was created.', 'success', 5);
				self.AllUsers.push(result.User);
				ClearForm();
			}
		});
	}	

	this.ToggleChangePassword = function(){
		this.Password1 = "";
		this.Password2 = "";
		
		this.ShowChangePassword = !this.ShowChangePassword; 
	}

	$scope.$on('ShowUserDetails', function(e){
		$scope.UserForm.$setPristine();
	});

	this.UpdateUser = function(){
		//TODO: refactor and put alertify calls in sep fn
		var UpdatedUserObj = {_id: this._id, FirstName: this.FirstName, LastName: this.LastName, Email: this.Email, Password: this.Password1, 
			IsAdmin: this.IsAdmin, IsEmployee: true}
		UserService.UpdateUser(UpdatedUserObj, function(result) {
			if(result.data.PasswordUpdated && !result.data.Error){
				MyAlert('User and Password Updated!', 'success', 5);	
				self.Password1 = "";
				self.Password2 = "";
				ClearForm();
				self.AllUsers[currentIndex] = result.data.User;
			}else if(!result.data.PasswordUpdated && !result.data.UserUpdated && !result.data.Error && !result.data.NothingChanged){
				MyAlert('Password already in use, choose another password.', 'error', 5);
				self.Password1 = "";
				self.Password2 = "";
				self.UserForm.$setPristine();
			}else if(result.data.UserUpdated && !result.data.PasswordUpdated && !result.data.Error){
				MyAlert('User Updated!', 'success', 5);
				self.Password1 = "";
				self.Password2 = "";
				ClearForm();
				self.AllUsers[currentIndex] = result.data.User;
			}else if(result.data.NothingChanged){
				MyAlert('You made no changes, try again.', 'error', 5);
			}else if(result.data.Error){
				MyAlert('Login timed out, please login again.', 'error', 5);
				$location.path('/login');
			}
		});
	}

	function MyAlert(message, type, time, cb){
		alertify.notify(message, type, time, cb);
		self.Password1 = "";
		self.Password2 = "";
	}

	this.DeleteUser = function(user, index){
		UserService.DeleteUser(user._id, function(result){
			self.AllUsers.splice(index, 1);
			UserService.PutCachedUsers("UsersArray", self.AllUsers);
			MyAlert('That user was deleted.', 'error', 5);
		});
	}

	this.BackToUsers = function(){
		this.AllUsers = UserService.GetCachedUsers("UsersArray");  
		ClearForm();
	}

	function ClearForm(){
		self.DisplayMode = 'list';
		self.UserForm.$setPristine();
		self.ShowChangePassword = false;

	}
	
}

UserController.$inject = ['$scope', 'UserService', 'ValidationService', '$location'];

app.controller('UserController', UserController);