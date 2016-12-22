function DetailController(ProductService, $routeParams, SettingsService, $rootScope, CartService, $location) {

	var self = this;
	// $rootScope.$broadcast("ChooseActiveNav", 1);
	this.Quantity = 1;

	this.Sizes = SettingsService.GetSizes();
	this.SimilarProducts = [];


	// load the selected product from the service
	ProductService.GetProductDetail(function(product) {
		self.Product = product;
		UpdatePrice(product.DefaultSize, product);
		$('html, body').animate({scrollTop:0}, 'slow');
	});

	function UpdatePrice(size, product) {
		switch(size) {
			case "10X16":
				self.Product.SelectedPrice = product.SmallPrice;
				break;
			case "12X20":
				self.Product.SelectedPrice = product.MedPrice;
				break;
			case "16X32":
				self.Product.SelectedPrice = product.LargePrice;
				break;	
		}	
	}

	this.ChangeSize = function(size) {
		UpdatePrice(size, self.Product);
	}


	// on page load, load similar products
	GetSimilarProducts();
	
	function GetSimilarProducts() {
		var cachedProducts = ProductService.GetCachedProducts("Products");
		if(!cachedProducts) {
			ProductService.GetAllProducts(function(products) {
				SimilarProducts(products);
			});
		}else {
			SimilarProducts(cachedProducts);
		}	
	}
	

	function SimilarProducts(products) {
		for(var i = 0; i < products.length; i++) {
			if(products[i].Category == self.Product.Category && products[i].Title != self.Product.Title) {
				self.SimilarProducts.push(products[i]);
			}	
		}
	}	
	// if similar clicked, set the current product in prod service and rebind 
	this.SelectSimilar = function(product) {
		ProductService.SetProductDetail(product);
		$location.path("/shop/" + SettingsService.WithDashes(product.Title));
	}

	this.AddToCart = function() {
		CartService.AddToCart(self.Product, self.Quantity, function(cart) {
			$rootScope.$broadcast("UpdateCart");
		});
		
	}

}

DetailController.$inject = ['ProductService', '$routeParams', 'SettingsService', '$rootScope', 'CartService', '$location'];

app.controller('DetailController', DetailController);