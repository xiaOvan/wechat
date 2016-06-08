exports.init = function (app) {
	var wechat_cfg = require('../config/wechat.cfg');
	var http = require('http');
        var util = require("util");
        var moment = require("moment");
        var querystring = require("querystring");
	var url=require('url');
	var db = require('../db');
	var cache = require('memory-cache');
	var sha1 = require('sha1'); //签名算法
	//var url = require('url');
	var signature = require('../sign/signature');

	app.get('/',function(req,res){
		var url = req.protocol + '://' + req.host + req.path; //获取当前url
		//var url = req.originalUrl;
		console.log('request url'+ url);
		signature.sign(url,function(signatureMap){
			signatureMap.appId = wechat_cfg.appid;
			res.render('index',signatureMap);
		});
	});
	app.get('/comments',function(req,res){
		res.render('comments');
	});
        app.get('/list',function(req,res){
   var param = url.parse(req.url, true).query;
	 db.list(param.page, function(result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(util.format('%j', result));
        res.end();
    });
	});

	app.post('/save',function(req,res){
		var data={};
		var now = moment().format('YYYY-MM-DD HH:mm:ss');
		data.msg=req.body.msg;
		data.author=req.body.author;
		data.dtime = now;
	
		db.save(data,function(result){
		res.writeHead(200, {"Content-Type": "application/json"});	
		res.write(util.format('%j',result));
		res.end();
		});
		//res.send(req.body);	
	});

/*
       app.post('/save',function(req,res){
	    var str = '';
    req.on("data", function(chunk) {
        str += decodeURIComponent(chunk);
    });

    req.on("end", function() {
        var param = querystring.parse(str);
        var data = {};
        var now = moment().format('YYYY-MM-DD HH:mm:ss');
        data.author = param.author;
	console.log(data.author);
        data.msg = param.msg;
        data.dtime = now;
	res.send(data);
        db.save(data, function(result) {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(util.format('%j', result));
            res.end();
        });
    });
        });
*/
};
