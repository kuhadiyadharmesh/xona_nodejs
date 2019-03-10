const Country = require('../models/country.model');
const CommonFile = require('../constant')

exports.country_create = function (req, res) {

    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
            let country = new Country(
                {name: req.body.name }
            );
        
           // console.log(JSON.stringify(req.body, null, 2));
        
        
            Country.findOne( {  name :  req.body.name  }, function(err, object){
                if (object) {
                    //update
                   return res.send({ status : 0 , msg : "country already existed."})
                } else {
                    //insert
                    country.save(function (err) {
                       // console.log(err);
                        if (err)
                      return  res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                        else
                      return  res.send({ status : 1 , msg : "country insert successfully." , data :country});
                    })
                }
            });
        }
    })
    
};
exports.country_details = function (req, res) {
    Country.find({}, function (err, country) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
            //if(JSON.stringify(country, null, 2).length > 2)
            res.send({ status : 1 , msg : "country listed successfully." , data :country});
            ///else
           // res.send({ status : 0 , msg : "no country found."}));
        }
        
    })
};

exports.country_update = function (req, res) 
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
        console.log(JSON.stringify(req.body, null, 2));
        Country.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, country) 
        {
            if (err) 
           return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
            else
           return res.send({ status : 1 , msg : "country updated successfully."});
        });
    }
    })
    
};
exports.country_delete = function (req, res) {
   
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
        Country.findByIdAndRemove(req.params.id, function (err) {
            if (err) 
          return  res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
            else
          return  res.send({ status : 1 , msg : "country deleted successfully."});
        })
    }})
};