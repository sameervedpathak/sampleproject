var mysql = require('mysql');
var CRUD = require('mysql-crud');
var async = require("async");
var fs = require('fs-extra')
var env = require('./environment');
var connection = env.Dbconnection;
var productCRUD = CRUD(connection, 'user_products');
var imageCRUD = CRUD(connection, 'images');
var userCRUD = CRUD(connection, 'users');

/**
 * @api {get} /allproduct generate list of products
 * @apiName findAll
 * @apiGroup /admin/product
 *
 */
exports.findAll = function(req, res) {

    connection.query("SELECT mt.maincatg_name, mt.maincatg_id, ct.catg_name, ct.catg_id, cur.CurrencyCode, cur.CurrencyName, cur.CurrencySymbol, t.*, (SELECT P.ImageName FROM images as P WHERE P.`RecordId` = t.UProduct_id LIMIT 1) as ImageName FROM `user_products` as t left join category as ct on t.catg_id=ct.catg_id left join main_category as mt on mt.maincatg_id=t.maincatg_id left join currency as cur on t.Currency=cur.CurrencyCode WHERE t.IsActive=1 order by t.UProduct_id DESC", function(err, rows) {
        if (rows.length > 0) {
            res.jsonp(rows);
        } else {
            res.jsonp("");
        }
    });
};

exports.getProductImages = function(req, res) {
    var imgfor = req.body.ImageFor;
    var recid = req.params.productId;
    connection.query('select * from images where RecordId=' + recid, function(err, rows) {
        if (rows.length > 0) {
            responsedata = {
                status: true,
                record: rows,
                message: 'image List'
            };
            res.jsonp(responsedata);
            //res.jsonp(rows);
        } else {
            responsedata = {
                status: false,
                message: 'image not available'
            };
            res.jsonp(responsedata);
        }
    });
};

exports.getAllProductBySuperCategory = function(req, res) {
    var sid = parseInt(req.params.sid);
    connection.query("SELECT mt.maincatg_name, mt.maincatg_id, ct.catg_name, ct.catg_id, cur.CurrencyCode, cur.CurrencyName, cur.CurrencySymbol, t.*, (SELECT P.ImageName FROM images as P WHERE P.`RecordId` = t.UProduct_id LIMIT 1) as ImageName FROM `user_products` as t left join category as ct on t.catg_id=ct.catg_id left join main_category as mt on mt.maincatg_id=t.maincatg_id left join currency as cur on t.Currency=cur.CurrencyCode WHERE t.IsActive=1 and t.maincatg_id=" + sid, function(err, rows) {
        if (rows.length > 0) {
            res.jsonp(rows);
        } else {
            res.jsonp("");
        }
    });
};

exports.getAllProductByCategory = function(req, res) {
    var cid = parseInt(req.params.cid);
    connection.query("SELECT mt.maincatg_name, mt.maincatg_id, ct.catg_name, ct.catg_id, cur.CurrencyCode, cur.CurrencyName, cur.CurrencySymbol, t.*, (SELECT P.ImageName FROM images as P WHERE P.`RecordId` = t.UProduct_id LIMIT 1) as ImageName FROM `user_products` as t left join category as ct on t.catg_id=ct.catg_id left join main_category as mt on mt.maincatg_id=t.maincatg_id left join currency as cur on t.Currency=cur.CurrencyCode WHERE t.IsActive=1 and t.catg_id=" + cid, function(err, rows) {
        if (rows.length > 0) {
            res.jsonp(rows);
        } else {
            res.jsonp("");
        }
    });
};

exports.getUserProducts = function(req, res) {
    //var uid = parseInt(req.params.uid);
    var uid = parseInt(req.params.UserId);
    //var sql = 'select * from user_products where IsActive = 1 and CreatedBy = ? ';
    var sql = 'SELECT user_products.* , images.ImageName ' +
        'FROM user_products ' +
        'INNER JOIN images ' +
        'on user_products.UProduct_id = images.RecordId ' +
        'where user_products.IsActive = 1 and user_products.CreatedBy = ' + uid + '';
    connection.query(sql, uid, function(err, rows) {
        if (err) res.sendStatus(403);
        if (rows) {
            res.jsonp(rows);
        }
    });
};

/**
 * @api {get} /admin/getproduct/:id get particuler product details
 * @apiName findById
 * @apiGroup /admin/product
 *
 */
exports.findById = function(req, res) {
    var id = parseInt(req.params.pid);
    connection.query("SELECT mt.maincatg_name, mt.maincatg_id, ct.catg_name, ct.catg_id, cur.CurrencyCode, cur.CurrencyName, cur.CurrencySymbol, t.*, (SELECT P.ImageName FROM images as P WHERE P.`RecordId` = t.UProduct_id LIMIT 1) as ImageName FROM `user_products` as t left join category as ct on t.catg_id=ct.catg_id left join main_category as mt on mt.maincatg_id=t.maincatg_id left join currency as cur on t.Currency=cur.CurrencyCode WHERE t.IsActive=1 and t.UProduct_id =" + id, function(err, rows) {
        if (rows.length > 0) {
            res.jsonp(rows);
        } else res.jsonp("");
        //query returns array of arrays we need to return the first one only.
    });
};

exports.selectProduct = function(req, res) {
    productCRUD.load({
        'UProduct_id': req.body.UProduct_id
    }, function(error, result) {
        if (result) {
            responsedata = {
                status: true,
                record: result,
                message: 'product List'
            }
            res.jsonp(responsedata);
        } else {
            responsedata = {
                status: false,
                record: result,
                message: 'product List Failed'
            }
            res.jsonp(responsedata);
        }
    });
}

/**
 * @api {post} /admin/addproduct/   add new product
 * @apiName insertProduct
 * @apiGroup /admin/product
 * @apiParam {String} product_name  	Mandatory Product Name.
 * @apiParam {String} product_description  Mandatory Product description.
 * @apiParam {Number} product_price 	Mandatory Product alias without space.
 * @apiParam {Number} qtytype_id  	Mandatory Product Quantity foreign key.
 * @apiParam {Number} [Size]  optional product size.
 * @apiParam {Number} [colour_id]  optional product color foreign key.
 * @apiParam {Number} vendor_id     Admin will select vendor id.
 * @apiParam {Number} maincatg_id   Mandatory Main Category table foreign key.
 * @apiParam {Number} catg_id 	Mandatory category table foreign key.
 * @apiParam {Number} subcatg_id   Sub Category table foreign key.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */
exports.insertProduct = function(req, res) {
    productCRUD.create({
        'Ad_Title': req.body.Ad_Title,
        'Description': req.body.Description,
        'Price': req.body.Price,
        'Shipping': req.body.Shipping,
        'IsSaveLater': req.body.IsSaveLater,
        'maincatg_id': req.body.maincatg_id,
        'Catg_id': req.body.Catg_id,
        'CreatedBy': req.body.CreatedBy,
        'Currency': req.body.Currency,
        'CreatedOn': env.timestamp(),
        'IsActive': 1
    }, function(error, result) {
        if (result) {
            if (req.body.images.length > 0) {
                async.eachSeries(req.body.images, function(image, nextImage) {
                        // Call an asynchronous function, often a save() to DB
                        uploadPic(result.insertId, image.file, 'product', function(responsd) {
                            nextImage();
                        });
                    },
                    // 3rd param is the function to call when everything's done
                    function(err, nextImage) {
                        // All tasks are done now
                        responsedata = {
                            status: true,
                            record: result,
                            product_id: result.insertId,
                            message: 'product Inserted successfully'
                        };
                        res.jsonp(responsedata);
                    });
            } else {
                responsedata = {
                    status: true,
                    record: result,
                    product_id: result.insertId,
                    message: 'product Inserted successfully'
                };
                res.jsonp(responsedata);
            }


        } else {
            responsedata = {
                status: false,
                record: error,
                message: 'product Failed Insert'
            };
            res.jsonp(responsedata);
        }
    });
}


/**
 * @api {post} /admin/editproduct/   update product details
 * @apiName updateProduct
 * @apiGroup /admin/product
 * @apiParam {Number} product_id    	Mandatory product id to update particuler record.
 * @apiParam {String} product_name  	Mandatory Product Name.
 * @apiParam {String} product_description  Mandatory Product description.
 * @apiParam {Number} product_price 	Mandatory Product alias without space.
 * @apiParam {Number} qtytype_id  	Mandatory Product Quantity foreign key.
 * @apiParam {Number} [size]  optional product size.
 * @apiParam {Number} [colour_id]  optional product color foreign key.
 * @apiParam {Number} vendor_id    Admin will select vendor id.
 * @apiParam {Number} maincatg_id   Mandatory Main Category table foreign key.
 * @apiParam {Number} catg_id 	Mandatory category table foreign key.
 * @apiParam {Number} subcatg_id   Sub Category table foreign key.
 *
 * @apiParam (Login) {String} pass Only logged in users can post this.
 *                                 In generated documentation a separate
 *                                 "Login" Block will be generated.
 */


exports.updateProduct = function(req, res) {
    //console.log(req.body);
    var UProduct_id = req.body.UProduct_id;
    productCRUD.update({ 'UProduct_id': UProduct_id }, {
        'Ad_Title': req.body.Ad_Title,
        'Description': req.body.Description,
        'Price': req.body.Price,
        'Shipping': req.body.Shipping,
        'IsSaveLater': req.body.IsSaveLater,
        'maincatg_id': req.body.maincatg_id,
        'Catg_id': req.body.Catg_id,
        'CreatedBy': req.body.CreatedBy,
        'ModifiedOn': env.timestamp(),
        'IsActive': 1
    }, function(err, vals) {
        if (parseInt(vals.affectedRows) > 0) {
            var resdata = {
                status: true,
                message: 'product successfully updated'
            };
            res.jsonp(resdata);
        } else {
            var resdata = {
                status: false,
                message: 'record not updated'
            };
            res.jsonp(resdata);
        }
    });
}

/**
 * @api {get} /admin/deleteProduct/:id delete particuler product from database
 * @apiName deleteProduct
 * @apiGroup /admin/product
 * @apiParam {Number} product_id   Product id to delete particule record from primary key.
 *
 */
exports.deleteProduct = function(req, res) {
    var productId = parseInt(req.params.id);
    productCRUD.destroy({
        'UProduct_id': productId,
    }, function(error, result) {
        if (result) {

            responsedata = {
                status: true,
                record: result,
                message: 'product Deleted successfully'
            }
            res.jsonp(responsedata);
        } else {
            responsedata = {
                status: false,
                record: result,
                message: 'product Failed to Delete'
            }
            res.jsonp(responsedata);
        }

    });
}

var uploadPic = function(recordid, filedata, imageFor, callback) {
    var imagedata = filedata;
    //var imagedata1 = req.body.attachmentfile2;

    function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var response = {};
        if (matches.length !== 3) {
            return;
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        console.log(response);
        return response;
    };

    var decodedImg = decodeBase64Image(imagedata);
    //var decodedImg1 = decodeBase64Image(imagedata1);
    var imageBuffer = decodedImg.data;
    //var imageBuffer1 = decodedImg1.data;

    var type = decodedImg.type;
    //var type1 = decodedImg1.type;
    function getRandomSpan() {
        return Math.floor((Math.random() * 99999999999) + 1);
    };
    var fileName = getRandomSpan() + "_product.jpg";

    try {
        fs.writeFileSync(env.uploadpath + "/productimages/" + fileName, imageBuffer, 'utf8');
    } catch (err) {
        console.log(err, '298');
        var response = {
            status: 0,
            message: 'INTERNAL ERROR'
        };
    }

    imageCRUD.create({
        'ImageFor': imageFor,
        'RecordId': recordid,
        'ImageName': fileName,
    }, function(error, result) {
        if (result) {
            var response = {
                status: true,
                record: result,
                productimage: fileName,
                message: 'storyimage Image successfully Updated.'
            };
            callback(response);
        } else {
            var response = {
                status: false,
                message: 'INTERNAL ERROR'
            };
            callback(response);
        }
    });

}
