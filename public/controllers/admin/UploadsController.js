function UploadsController(ProductService, $location, SettingsService) {

	this.Categories = ProductService.GetCachedCategories("Categories");

	this.Sizes = SettingsService.GetSizes();


	if(this.Categories == null || this.Categories == undefined || this.Categories == "undefined") {
		ProductService.GetAllCategories(function(dbArray){
			self.Categories = dbArray;
		});
	}

	this.Image1 = "";
	this.Image2 = "";
	this.Image3 = "";
	this.Title = "";
	this.SmallPrice = "";
	this.MedPrice = "";
	this.LargePrice = "";
	this.Category = "";
	this.DefaultSize = "";
	this.Images = [];
	this.Description = "";


	this.UploadProduct = function() {
		//Leaves in the Wind tells a story of peace in the middle of a stormy winter. Only holding on to serenity will keep man alive! 
		this.Images = [];
		var images = [];
		this.Images.push(this.Image1, this.Image2, this.Image3);
		for(var i = 0; i < this.Images.length; i++) {
			if(this.Images[i] != "") {
				images.push(this.Images[i]);
			}
		}
		var product = {Images: images, Category: this.Category, SmallPrice: this.SmallPrice, MedPrice: this.MedPrice, LargePrice: this.LargePrice, Title: this.Title, Description: this.Description, DefaultSize: this.DefaultSize};
		ProductService.AddNewProduct(product, function(result) {
			$location.path('/admin/products');
			console.log(result);
		});
	}

	this.Cancel = function() {
		$location.path('/admin/products');
	}


}

UploadsController.$inject = ['ProductService', '$location', 'SettingsService'];
app.controller('UploadsController', UploadsController);