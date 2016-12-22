function AdminController($scope, $rootScope, UserService, $routeParams, $location) {
	
	this.Tabs = [ 'views/admin/partials/users.html', 'views/admin/partials/categories.html', 'views/admin/partials/products.html', 'views/admin/partials/uploads.html', 'views/admin/partials/orders.html' ];
	var self = this;
	
	this.TabView = this.Tabs[0];	
	this.Tab = 0;
	
	
	if($routeParams.type == "users") {
		this.Tab = 0;
		this.TabView = this.Tabs[0];
	}else if($routeParams.type == "categories") {
		this.Tab = 1;
		this.TabView = this.Tabs[1];
	}else if($routeParams.type == "products") {
		this.Tab = 2;
		this.TabView = this.Tabs[2];
	}else if($routeParams.type == "uploads") {
		this.Tab = 3;
		this.TabView = this.Tabs[3];
	}else if($routeParams.type == "orders") {
		this.Tab = 4;
		this.TabView = this.Tabs[4];
	}

	this.SelectTab = function (setTab) {
		if(setTab == 0) {
			$location.path('/admin/users');
		}else if(setTab == 1) {
			$location.path('/admin/categories');
		}else if(setTab == 2) {
			$location.path('/admin/products');
		}else if(setTab == 3) {
			$location.path('/admin/uploads');
		}else if(setTab == 4) {
			$location.path('/admin/orders');
		}
	}

	this.IsSelected = function (checkTab) {
		return self.Tab === checkTab;
	}


};

AdminController.$inject = ['$scope', '$rootScope', 'UserService', '$routeParams', '$location'];
app.controller('AdminController', AdminController);