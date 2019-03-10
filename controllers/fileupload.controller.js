var uniqid = require('uniqid');

var fs = require('fs');
let replace_file = "http://xona.f4p.in";

exports.ad_template_icon = function (req, res)  
{
  var dic = "/assets/images/advertise/icon/";
  var prf = "icon-";
    //console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './public'+dic);
        },
        filename: function (request, file, callback) {
           // console.log(file);
           // var ext = path.extname(file.filename).split('.');
            //console.log(ext);
            callback(null, uniqid(prf)+file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');

    upload (req, res, function(err)  {
        if (err) {
            return res.status(400).send(
              {status : 0 ,
                message: err
              });
        }
        let results = req.files.map(
          function(file) 
         {
            return { status : 1 ,msg : "icon upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        });

        res.status(200).json(results[0]);
    });
      /*
res.status(200).send(
          { status : 1 ,msg : "icon upload successfully",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        );//.json(results);
    });
    */
}

exports.ad_template_background = function (req, res)  
{
  var dic = "/assets/images/advertise/tm_background/";
  var prf = "tm_background-";
    //console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './public'+dic);
        },
        filename: function (request, file, callback) {
           // console.log(file);
           // var ext = path.extname(file.filename).split('.');
            //console.log(ext);
            callback(null, uniqid(prf)+file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');

    upload (req, res, function(err)  {
        if (err) {
            return res.status(400).send({
              status : 0 ,
                message: err
            });
        }
        let results = req.files.map(function(file)  {
          return { status : 1 ,msg : "background upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        });
        res.status(200).json(results[0]);
    });
}
//upload_final_banner
exports.ad_template_fullbanner = function (req, res)  
{
  var dic = "/assets/images/advertise/tm_fullbanner/";
  var prf = "tm_fullbanner-";
    //console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './public'+dic);
        },
        filename: function (request, file, callback) {
           // console.log(file);
           // var ext = path.extname(file.filename).split('.');
            //console.log(ext);
            callback(null, uniqid(prf)+file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');

    upload (req, res, function(err)  {
        if (err) {
            return res.status(400).send({
              status : 0 ,
                message: err
            });
        }
        let results = req.files.map(function(file)  {
          return { status : 1 ,msg : "Banner upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        });
        res.status(200).json(results[0]);
    });
}

exports.ad_template_fullvideo = function (req, res)  
{
  var dic = "/assets/images/advertise/tm_fullvideo/";
  var prf = "tm_fullvideo-";
    //console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './public'+dic);
        },
        filename: function (request, file, callback) {
           // console.log(file);
           // var ext = path.extname(file.filename).split('.');
            //console.log(ext);
            callback(null, uniqid(prf)+file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');

    upload (req, res, function(err)  {
        if (err) {
            return res.status(400).send({
              status : 0 ,
                message: err
            });
        }
        let results = req.files.map(function(file)  {
          return { status : 1 ,msg : "Video upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        });
        res.status(200).json(results[0]);
    });
}

exports.ad_template_example = function (req, res)  
{
  var dic = "/assets/images/advertise/admin_banner/";
  var prf = "banner-";
    //console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './public'+dic);
        },
        filename: function (request, file, callback) {
           // console.log(file);
           // var ext = path.extname(file.filename).split('.');
            //console.log(ext);
            callback(null, uniqid(prf)+file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');

    upload (req, res, function(err)  
    {
        if (err) {
            return res.status(400).send({
              status : 0 ,
                message: err
            });
        }
        let results = req.files.map(function(file)  {
          return { status : 1 ,msg : "Banner upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        });
        res.status(200).json(results[0]);
    });
}

exports.user_advertiser_document = function (req, res)  
{
  var dic = "/assets/images/user_advertiser/document/";
  var prf = "doc_user-";
    //console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './public'+dic);
        },
        filename: function (request, file, callback) {
           // console.log(file);
           // var ext = path.extname(file.filename).split('.');
            //console.log(ext);
            callback(null, uniqid(prf)+file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');

    upload (req, res, function(err)  
    {
        if (err) {
            return res.status(400).send({
              status : 0 ,
                message: err
            });
        }
        let results = req.files.map(function(file)  {
          return { status : 1 ,msg : "Document upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        });
        res.status(200).json(results[0]);
    });
}

exports.user_advertiser_profile = function (req, res)  
{
  var dic = "/assets/images/user_advertiser/profile/";
  var prf = "pro-";
    //console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './public'+dic);
        },
        filename: function (request, file, callback) {
           // console.log(file);
           // var ext = path.extname(file.filename).split('.');
            //console.log(ext);
            callback(null, uniqid(prf)+file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');

    upload (req, res, function(err)  
    {
        if (err) {
            return res.status(400).send({
              status : 0 ,
                message: err
            });
        }
        let results = req.files.map(function(file)  {
          return { status : 1 ,msg : "profile upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        });
        res.status(200).json(results[0]);
    });
}

exports.user_user_document = function (req, res)  
{
  var dic = "/assets/images/user_normal/document/";
  var prf = "doc_user-";
    //console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './public'+dic);
        },
        filename: function (request, file, callback) {
           // console.log(file);
           // var ext = path.extname(file.filename).split('.');
            //console.log(ext);
            callback(null, uniqid(prf)+file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');

    upload (req, res, function(err)  
    {
        if (err) {
            return res.status(400).send({
              status : 0 ,
                message: err
            });
        }
        let results = req.files.map(function(file)  {
          return { status : 1 ,msg : "Document upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        });
        res.status(200).json(results[0]);
    });
}

exports.user_user_profile = function (req, res)  
{
  var dic = "/assets/images/user_normal/profile/";
  var prf = "pro-";
    //console.log(req.f);
    const multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (request, file, callback) {
            callback(null, './public'+dic);
        },
        filename: function (request, file, callback) {
           // console.log(file);
           // var ext = path.extname(file.filename).split('.');
            //console.log(ext);
            callback(null, uniqid(prf)+file.originalname)
        }
    });
    const upload = multer({storage: storage}).any('file');

    upload (req, res, function(err)  
    {
        if (err) {
            return res.status(400).send({
              status : 0 ,
                message: err
            });
        }
        let results = req.files.map(function(file)  {
          return { status : 1 ,msg : "profile upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
        });
        res.status(200).json(results[0]);
    });
}
exports.help_desk = function (req, res)  
{
   var dic = "/assets/images/help_desk/";
   var prf = "hpl-";
     //console.log(req.f);
     const multer = require('multer');
     var storage = multer.diskStorage({
         destination: function (request, file, callback) {
             callback(null, './public'+dic);
         },
         filename: function (request, file, callback) {
            // console.log(file);
            // var ext = path.extname(file.filename).split('.');
             //console.log(ext);
             callback(null, uniqid(prf)+file.originalname)
         }
     });
     const upload = multer({storage: storage}).any('file');
 
     upload (req, res, function(err)  
     {
         if (err) {
             return res.status(400).send({
               status : 0 ,
                 message: err
             });
         }
         let results = req.files.map(function(file)  {
           return { status : 1 ,msg : "Help Desk image upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
         });
         res.status(200).json(results[0]);
     });
}
exports.notification_img = function (req, res)  
{
   var dic = "/assets/images/notification_img/";
   var prf = "noti-";
     //console.log(req.f);
     const multer = require('multer');
     var storage = multer.diskStorage({
         destination: function (request, file, callback) {
             callback(null, './public'+dic);
         },
         filename: function (request, file, callback) {
            // console.log(file);
            // var ext = path.extname(file.filename).split('.');
             //console.log(ext);
             callback(null, uniqid(prf)+file.originalname)
         }
     });
     const upload = multer({storage: storage}).any('file');
 
     upload (req, res, function(err)  
     {
         if (err) {
             return res.status(400).send({
               status : 0 ,
                 message: err
             });
         }
         let results = req.files.map(function(file)  {
           return { status : 1 ,msg : "Notification image upload successfully.",data:{img_name : file.filename,image_path: 'http://' + req.headers.host + dic + file.filename}}
         });
         res.status(200).json(results[0]);
     });
}
 exports.user_document = function (req, res)  
 {
     console.log(req.f);
     const multer = require('multer');
     var storage = multer.diskStorage({
         destination: function (request, file, callback) {
             callback(null, './uploads/');
         },
         filename: function (request, file, callback) {
             //console.log(file);
             callback(null, file.originalname)
         }
     });
     const upload = multer({storage: storage}).any('file');
     upload (req, res, function(err)  {
         if (err) {
             return res.status(400).send({
                 message: err
             });
         }
         let results = req.files.map(function(file)  {
             return {
                 mediaName: file.filename,
                 origMediaName: file.originalname,
                 mediaSource: 'http://' + req.headers.host + "" + file.filename
             }
         });
         res.status(200).json(results);
     });
     
 }
 exports.delete_file = function(req , res)
 {
     //let path = req.body.filelink;
    let path = (req.body.filelink).replace(replace_file,"public").replace("http://localhost:80","public")
     console.log(path)
    fs.unlink(path,(err )=>
    {
        if(err)
        {
            res.status(200).send({status : 0 ,msg : err.message})
        }
        else
        {
            res.status(200).send({status : 1 ,msg : "File deleted successfully."})
        }
    })
 }
