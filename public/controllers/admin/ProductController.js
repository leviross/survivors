function ProductController(ProductService, SettingsService) {

	this.Sizes = SettingsService.GetSizes();

	var self = this;
	var currentProduct = null;
	this.currentIndex = null;
	this.DisplayMode = 'list';
	this.Images = [];
	var images = [];
	var imageChange = false;


	this.Products = ProductService.GetCachedProducts("Products");

	if(this.Products != null && this.Products != undefined && this.Products != "undefined") {
		for(var i = 0; i < this.Products.length; i++) {
			if(typeof this.Products[i] != "object") {
				ProductService.GetAllProducts(function(dbArray) {
					self.Products = dbArray;
				});
			}
		}
	}else {
		ProductService.GetAllProducts(function(dbArray) {
			self.Products = dbArray;
		});
	}

	this.Categories = ProductService.GetCachedCategories("Categories");

	if(this.Categories == null || this.Categories == undefined || this.Categories == "undefined"){
		ProductService.GetAllCategories(function(dbArray){
			self.Categories = dbArray;
		});
	}

	this.EditProduct = function(product, index) {
		this.Images = [];
		images = [];
		this.DisplayMode = 'edit';
		currentProduct = product;
		this.currentIndex = index;
		this.Title = product.Title;
		this.Description = product.Description;
		this.DefaultSize = product.DefaultSize;
		this.SmallPrice = product.SmallPrice;
		this.MedPrice = product.MedPrice;
		this.LargePrice = product.LargePrice;
		this.Category = product.Category;
		this._id = product._id;
		for (var i = 0; i < product.Images.length; i++) {
			this.Images.push(product.Images[i]);
			images.push(product.Images[i]);
		}
		
	}

	this.UpdateProduct = function() {
		
		if(this.Image1) {
			images[0] = this.Image1;
			imageChange = true;
		}
		if(this.Image2) {
			images[1] = this.Image2;
			imageChange = true;
		}
		if(this.Image3) {
			images[2] = this.Image3;
			imageChange = true;
		}

		var product = {_id: this._id, ImageChange: imageChange, Images: images, Title: this.Title, Description: this.Description, DefaultSize: this.DefaultSize, SmallPrice: this.SmallPrice, MedPrice: this.MedPrice, LargePrice: this.LargePrice, Category: this.Category};
		ProductService.UpdateProduct(product, this.currentIndex, function(result) {
			alertify.notify('Product Updated!', 'success', 5, function(){});
			self.DisplayMode = 'list';
		});
	}

	this.DeleteImage = function(index) {
		this.Images.splice(index, 1);
		images.splice(index, 1);
	}

	this.CreateProduct = function(){
		ProductService.AddNewProduct(this.Product, function(retval){
			self.Product = retval;
		});
	}

	this.Cancel = function() {
		this.DisplayMode = 'list';
	}

	this.DeleteProduct = function(product, index) {
		this.Products.splice(index, 1);
		ProductService.DeleteProduct(product._id, index, function(result) {
			alertify.notify('Product Deleted!', 'warning', 5, function(){});
		});
	}



}

ProductController.$inject = ['ProductService', 'SettingsService'];

app.controller('ProductController', ProductController);