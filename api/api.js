const express = require('express');
const app = express();
const validator = require('express-validator');
const bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Credentials', false);
  next();
});
app.use(validator());
app.use(bodyParser.json({ limit: '50mb', extended: true, type:'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, type:'application/x-www-form-urlencoding' }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ limit: '50mb' }));


var userlogin = require('./userlogin.js');
var todos = require('./todos.js');
var device_register = require('./device_register.js');
var adminlogin = require('./adminLogin');
var userProducts = require('./user_product.js');


/***Super admin api****/
var sadmin_userlogin = require('./sadmin/superadmin.js');
var sadmin_vendors = require('./sadmin/vendors.js');
var sadmin_mainCategory = require('./sadmin/main_category.js');
var sadmin_category = require('./sadmin/category.js');
var sadmin_subcategory = require('./sadmin/sub_category.js');
var sadmin_product = require('./sadmin/product.js');
var sadmin_tasMaster = require('./sadmin/tax_master.js');
var adminOrders = require('./sadmin/orders.js');

/***Super admin api end****/

/***Shopowner api****/
var shop_vendors = require('./shopowner/vendors.js');
var shop_category = require('./shopowner/category.js');
var shop_subcategory = require('./shopowner/sub_category.js');
var shop_product = require('./shopowner/product.js');
var shop_discount = require('./shopowner/discount.js');
var shop_vendorTaxMaster = require('./shopowner/vendor_tax_master.js');
/***Shopowner api end****/

var productRating = require('./product_rating.js');
var currency = require('./currency.js');
var users = require('./users.js');
var pay = require('./payment.js');
var order = require('./manage_orders.js');

//var sendpushnotification = require('./api/sendpushnotification.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/signup', userlogin.signup);
app.post('/api/login', userlogin.login);
app.post('/api/fblogin', userlogin.fblogin);
app.get('/api/verify/:id', userlogin.verify);


/*app.get('/api/verify/:id', function(req, res) {
    var errors = req.validationErrors();
    if (errors) {
      res.send(errors);
      return;
    }else{
      return userlogin.verify;
    }
});*/

app.get('/api/getUserDetails/:id', users.findById);
app.post('/api/updateUser', users.updateUser);
app.post('/api/updateprofileimage' , users.updateprofileimage);

app.post('/api/adminlogin', sadmin_userlogin.login);

// app.get('/api/getalluserproducts/:id', userProducts.getUserProducts);
app.get('/api/getAllProductBySuperCategory/:sid', userProducts.getAllProductBySuperCategory);
app.get('/api/getAllProductByCategory/:cid', userProducts.getAllProductByCategory);
app.get('/api/getUserProducts/:UserId', userProducts.getUserProducts);
app.get('/api/getproductbyid/:pid', userProducts.findById);
app.post('/api/addproduct', userProducts.insertProduct);
app.post('/api/editProduct', userProducts.updateProduct);
app.get('/api/deleteProduct/:id', userProducts.deleteProduct);
app.get('/api/allproduct', userProducts.findAll);
app.get('/api/getProductImages/:productId', userProducts.getProductImages);


app.get('/api/allcurrency', currency.findAll);

app.post('/api/addtodos', todos.addtodos);
app.post('/api/gettodos', todos.gettodos);
app.post('/api/gettododetails', todos.gettododetails);
app.post('/api/updatetodos', todos.updatetodos);
app.post('/api/deletetodo', todos.deletetodo);
app.post('/api/deviceregister', device_register.deviceregister);

app.post('/api/adminLogin', adminlogin.login);

/**Suerp admin Vendors api**/
app.get('/api/admin/allvendors', sadmin_vendors.findAll);
app.get('/api/admin/getvendor/:id', sadmin_vendors.findById);
app.post('/api/admin/addvendor', sadmin_vendors.insertVendor);

app.post('/api/admin/editvendor', sadmin_vendors.updateVendor);

app.post('/api/admin/deletevendor', sadmin_vendors.deleteVendor);
/**super admin Vendors api end here**/

/**Super admin main category api**/
app.get('/api/admin/maincategory', sadmin_mainCategory.findAll);

app.get('/api/admin/maincategoryarray', sadmin_mainCategory.getdataArray);


app.get('/api/admin/getmaincategory/:id', sadmin_mainCategory.findById);
app.post('/api/admin/addmaincategory', sadmin_mainCategory.insertMainCategory);
app.post('/api/admin/editmaincategory', sadmin_mainCategory.updateMainCategory);
app.get('/api/admin/deletemaincategory/:id', sadmin_mainCategory.deleteMainCategory);

app.post('/api/admin/editmaincategory', sadmin_mainCategory.updateMainCategory);
app.get('/api/admin/viewMainCategory/:id', sadmin_mainCategory.viewMainCategory);
app.get('/api/admin/getAllParentChildCategory', sadmin_mainCategory.getAllParentChildCategory);


/**Super admin main category api end here**/

/**Super admin category api**/
app.get('/api/admin/allcategory', sadmin_category.findAll);
app.get('/api/admin/getcategory/:id', sadmin_category.findById);
app.post('/api/admin/addcategory', sadmin_category.insertCategory);
app.post('/api/admin/editcategory', sadmin_category.updateCategory);
app.get('/api/admin/deletecategory/:id', sadmin_category.deleteCategory);
app.get('/api/admin/viewCategory/:id', sadmin_category.viewCategory);
app.get('/api/admin/getCategoryfromSuperCategory/:id', sadmin_category.getCategoryfromSuperCategory);


/**Super admin category api end here**/

/**Super admin sub category api**/
app.get('/api/admin/allsubcategory', sadmin_subcategory.findAll);
app.get('/api/admin/getsubcategory/:id', sadmin_subcategory.findById);
app.post('/api/admin/addsubcategory', sadmin_subcategory.insertSubCategory);
app.post('/api/admin/editsubcategory', sadmin_subcategory.updateSubCategory);
app.get('/api/admin/deletesubcategory/:id', sadmin_subcategory.deleteSubCategory);
/**Super admin sub category api end here**/

/**Super admin products api**/
app.get('/api/admin/allproduct', sadmin_product.findAll);
app.get('/api/admin/getproduct/:id', sadmin_product.findById);
app.post('/api/admin/addproduct', sadmin_product.insertProduct);
app.post('/api/admin/editproduct', sadmin_product.updateProduct);
app.post('/api/admin/deleteproduct', sadmin_product.deleteProduct);
/**Super admin products api end here**/

/**Super admin Tax master api**/
app.get('/api/admin/allTaxMaster', sadmin_tasMaster.findAll);
app.get('/api/admin/gettaxmaster/:id', sadmin_tasMaster.findById);
app.post('/api/admin/addtaxmaster', sadmin_tasMaster.insertTaxMaster);
app.post('/api/admin/editTaxMaster', sadmin_tasMaster.updateTaxMaster);
app.post('/api/admin/deleteTaxmaster', sadmin_tasMaster.deleteTaxMaster);
/**Super admin Tax master api end here**/

/**Shopowner api**/
app.get('/api/shop/allvendors', shop_vendors.findAll);
app.get('/api/shop/getvendor/:id', shop_vendors.findById);
app.post('/api/shop/addvendor', shop_vendors.insertVendor);
app.post('/api/shop/editvendor', shop_vendors.updateVendor);
app.post('/api/shop/deletevendor', shop_vendors.deleteVendor);
/**Shopowner api end here**/

/**Shopowner category api**/
app.get('/api/shop/allcategory', shop_category.findAll);
app.get('/api/shop/getcategory/:id', shop_category.findById);
app.post('/api/shop/addcategory', shop_category.insertCategory);
app.post('/api/shop/editcategory', shop_category.updateCategory);
app.post('/api/shop/deletecategory', shop_category.deleteCategory);
/**Shopowner category api end here**/

/**Shopowner sub category api**/
app.get('/api/shop/allsubcategory', shop_subcategory.findAll);
app.get('/api/shop/getsubcategory/:id', shop_subcategory.insertSubCategory);
app.post('/api/shop/editsubcategory', shop_subcategory.updateSubCategory);
app.post('/api/shop/deletesubcategory', shop_subcategory.deleteSubCategory);
/**Shopowner sub category api end here**/

/**Shopowner products api**/
app.get('/api/shop/allproduct', shop_product.findAll);
app.get('/api/shop/getproduct/:id', shop_product.findById);
app.post('/api/shop/addproduct', shop_product.insertProduct);
app.post('/api/shop/editproduct', shop_product.updateProduct);
app.post('/api/shop/deleteproduct', shop_product.deleteProduct);
/**Shopowner products api end here**/


/**Shopowner tax master api**/
app.get('/api/shop/allVendorsTaxMaster', shop_vendorTaxMaster.findAll);
app.get('/api/shop/getvendortaxmaster/:id', shop_vendorTaxMaster.findById);
app.post('/api/shop/addvendortaxmaster', shop_vendorTaxMaster.insertVendorTaxMaster);

app.post('/api/shop/editvendortaxmaster', shop_vendorTaxMaster.updateVendorTaxMaster);

app.post('/api/shop/deleteVendortaxmaster', shop_vendorTaxMaster.deleteVendortaxmaster);
/**Shopowner tax master api end here**/

/**Shopowner discounts api**/
app.get('/api/shop/alldiscount', shop_discount.findAll);
app.get('/api/shop/getdiscount/:id', shop_discount.findById);
app.post('/api/shop/adddiscount', shop_discount.insertDiscount);
app.post('/api/shop/editdiscount', shop_discount.updateDiscount);
app.post('/api/shop/deletediscount', shop_discount.deleteDiscount);
/**Shopowner discounts api end here**/

/**product ratings api**/
app.get('/api/getproductrating/:id', productRating.findById);
app.post('/api/addproductrating', productRating.insertProductRating);
app.post('/api/editproductrating', productRating.updateProductRating);
app.post('/api/deleteproductrating', productRating.deleteProductRating);
/**product ratings api end here**/

/*app.get('/api/sendnotification',sendpushnotification.sendnotification);*/
/** API to process card payment */
app.post('/api/paynow', pay.cardPayment);

/** Order management api's */
app.get('/api/getOrders/:userId', order.getOrders);
app.get('/api/getPurchases/:userId', order.getPurchases);

// Admin order api
app.get('api/admin/getOrders', adminOrders.findAll);

module.exports = app;
