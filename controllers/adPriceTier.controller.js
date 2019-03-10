const AdPriceTier = require('../models/adPriceTier.model');
const Admin_Config = require('../models/admin_config.model')
const CommonFile = require('../constant')

exports.getprice =  function (req, res)
{
    
        AdPriceTier.find({ad_type : req.body.ad_type}, function (err, adPriceTier) {
            if (err)
            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
            else
            {
                //console.log(JSON.stringify(country, null, 2));
                Admin_Config.find({group:1},function(err,admin_config)
                {
                    console.log(admin_config);
                    if(JSON.stringify(adPriceTier, null, 2).length > 2)
                    {
                        if(err)
                        {
                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        }
                        else
                        {

                            res.send(JSON.stringify({ status : 1 , msg : "price-tier listed successfully." , data :adPriceTier , tax_data:admin_config}));
                        }
                        
                    }
                    else
                    res.send(JSON.stringify({ status : 0 , msg : "no price-tier found."}));
                })
                
            }
            
        })
    
};
exports.getAllprice =  function (req, res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
        AdPriceTier.find({}, function (err, adPriceTier) {
            if (err)
           return res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
            else
            {
                //console.log(JSON.stringify(country, null, 2));
              return  res.send(JSON.stringify({ status : 1 , msg : "price-tier listed successfully." , data :adPriceTier }))  
            }
            
        })
    }})
    
};

exports.price_update = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
            AdPriceTier.findOneAndUpdate({_id : req.body.id , ad_type : req.body.ad_type},{$set : req.body} , function(err , adPriceTier){
                if(adPriceTier)
                {
                  return  res.send({status : 1 , msg : "advertise pricetire updated.",data : adPriceTier})
                    
                }
                else
                {
                   return res.send({status : 0 , msg : "Something gone wrong ."})
                }
            })
    }})
}

exports.getTax_data = function(req , res)
{
    Admin_Config.find({group:1},function(err,admin_config)
    {
        console.log(admin_config);
        //if(JSON.stringify(adPriceTier, null, 2).length > 2)
       // {
            if(err)
            {
              return  res.status(401).send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
            }
            else
            {

               return res.send(JSON.stringify({ status : 1 , msg : "price-tier listed successfully." ,  tax_data:admin_config}));
            }
            
       // }
       // else
      //  res.send(JSON.stringify({ status : 0 , msg : "no price-tier found."}));
    })
}
exports.Tax_update = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
            Admin_Config.findOneAndUpdate({_id : req.body.id, group : 1 , type : req.body.type},{$set : req.body},function(err , admin_config){
                if(admin_config)
                {
                   return res.send({status : 1 , msg : "Tax Ration updated", data : admin_config})
                }
                else
                {
                   return res.send({status : 0 , msg : "Something gone wrong ."})
                }
            })
    }})
}

exports.get_PointtoMoney = function(req , res)
{
    Admin_Config.find({group:2},function(err,admin_config)
    {
        console.log(admin_config);
        //if(JSON.stringify(adPriceTier, null, 2).length > 2)
       // {
            if(err)
            {
                res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
            }
            else
            {

                res.send(JSON.stringify({ status : 1 , msg : "Point to money listed successfully." ,  tax_data:admin_config}));
            }
            
       // }
       // else
      //  res.send(JSON.stringify({ status : 0 , msg : "no price-tier found."}));
    })
}
exports.update_Pointtomoney = function(req , res)
{
    console.log(req.body)
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
            Admin_Config.findOneAndUpdate({_id : req.body._id , group : 2 }, {$set : req.body}, function(err , admin_config){
                if(admin_config)
                {
                   return res.send({status : 1 , msg : "Point to money updated", data : ""})
                }
                else
               return res.send({status : 0 , msg : "Something gone wrong ."})
            })
        }
    })

}

exports.get_witdrawal_setting = function(req , res)
{
    Admin_Config.find({group:3},function(err,admin_config)
    {
        console.log(admin_config);
        //if(JSON.stringify(adPriceTier, null, 2).length > 2)
       // {
            if(err)
            {
                res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
            }
            else
            {

                res.send(JSON.stringify({ status : 1 , msg : "Withdrawal Setting listed successfully." ,  tax_data:admin_config}));
            }
            
       // }
       // else
      //  res.send(JSON.stringify({ status : 0 , msg : "no price-tier found."}));
    })
}
exports.update_witdrawal_setting = function(req , res)
{
    console.log(req.body)
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
            Admin_Config.findOneAndUpdate({_id : req.body._id , group : 3 }, {$set : req.body}, function(err , admin_config){
                if(admin_config)
                {
                  return  res.send({status : 1 , msg : "Withdraw Setting updated", data : ""})
                }
                else
                return res.send({status : 0 , msg : "Something gone wrong ."})
            })
        }
    })

}
exports.get_witdrawal_setting_charget = function(req , res)
{
    Admin_Config.findOne({group:3 , type :4},function(err,admin_config)
    {
        console.log(admin_config);
        //if(JSON.stringify(adPriceTier, null, 2).length > 2)
       // {
            if(err)
            {
                res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
            }
            else
            {

                res.send({ status : 1 , msg : "Withdrawal Charget Setting listed successfully." ,  data:admin_config});
            }
            
       // }
       // else
      //  res.send(JSON.stringify({ status : 0 , msg : "no price-tier found."}));
    })
}