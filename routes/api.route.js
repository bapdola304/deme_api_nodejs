var express = require('express');
var router = express.Router();
var testModel = require('../models/test.model');
let formidable = require("formidable");
let fs = require("fs");

/* GET home page. */
router.get('/getAll', async (req, res, next) => {
  	testModel.find().select({
  		_id : 1,
  		name:1,
  		description: 1,
  		price :1,
  		img : 1
  	}).exec((err, data) =>{
  		if(err){
  			res.json({
  				result : "loi"
  			});
  		}else{
  			res.json({
  				result : "ok",
  				count : data.length,
  				data1 : data
  			});
  		}
  	});
});
router.get('/getById', async (req, res, next) => {
	// require('mongoose').Types.ObjectId(req.query.id)
  	testModel.find(require('mongoose').Types.ObjectId(req.query.id),
  		(err, data) =>{
  		if(err){
  			res.json({
  				result : "loi"
  			});
  		}else{
  			res.json({
  				result : "ok",
  				count : data.length,
  				data1 : data

  			});
  		}
  	});
});

router.put('/update', async (req, res, next) => {
	// require('mongoose').Types.ObjectId(req.query.id)
	// require('mongoose').Types.ObjectId(req.query.id)
	let svName = require("os").hostname();
	let svPort = require("../app").settings.port;
 await testModel.updateOne({_id : req.body._id},{
 				name : req.body.name,
				price : req.body.price,
				img : `${svName}:${svPort}/api/openImage?imgname=${req.body.img1}`
			},(err,update) =>{
				if(err){
					res.json({
		  				result : "loi"
		  			});
				}else{
						res.json({
		  				result : "ok",
		  				data1 : update

		  			});
				}
			});

});
router.get('/getByName', async (req, res, next) => {
	// require('mongoose').Types.ObjectId(req.query.id)
	if(!req.query.name){
		res.json({
	  				result : "false",
	  				message : "name must be not null",
	  				data1 : []
	  			});
		return;

	}
	let criteria = {
		name : new RegExp(req.query.name, "i")
	};
	testModel.find(criteria).limit(10).sort({name : 1}).exec((err,data)=>{
		if(err){
  			res.json({
  				result : "loi"
  			});
  		}else{
  				res.json({
	  				result : "ok",
	  				count : data.length,
	  				data1 : data
	  			});
  			
  		}
  	});
  
});
router.post('/add', async (req, res, next) => {
  	let test = new testModel(req.body);
  	test.save(err =>{
  		if(err){
  			res.json({
  				result : "loi"
  			});
  		}else{
  			res.json({
  				result : "ok",
  				data : req.body
  			})
  		}
  	})


});
router.post('/uploadImage', async (req, res, next) => {
 
	var form = new formidable.IncomingForm();
	form.uploadDir = "./uploads";
	form.multiples  = true;
	form.parse(req,(err, fields, files) =>{
		if(err){
			res.json({
  				result : "loi"
  			});
		}
  var arrayOfFiles = [];
        if(files[""] instanceof Array) {
            arrayOfFiles = files[""];
        } else {
            arrayOfFiles.push(files[""]);
        }
		// let arrImage = files;
		let fileNames = [];
		// fileNames.push(files[''])
		if(arrayOfFiles.length > 0){
			arrayOfFiles.map(img => fileNames.push(img.path.split("\\")[1] + "." +img.name.split(".")[1]));
		} 

		res.json({
			result : "ok",
			data : fileNames

		})
		console.log(fileNames);
	});

});

router.get('/openImage', async (req, res, next) => {
  
let imgName = "uploads/" + req.query.imgname;
fs.readFile(imgName,(err,imgData) =>{
	if(err){
		res.json({
  				result : "loi",
  				message : "no image to upload"
  			});
	}
	res.writeHead(200, {"Content-type" : "image/jpeg"});
	res.end(imgData);
})

});

module.exports = router;