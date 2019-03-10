const AdFilterPriceTier = require('../models/adFilterPriceTier.model');
const CommonFile = require('../constant')

exports.filterprice_create = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
            var currentdate = new Date();
            let adFilterPriceTier = AdFilterPriceTier({
            filter_type:req.body.filter_type,
            name:req.body.name,
            filter_amt:req.body.filter_amt,
            free_values:req.body.free_values,
            cupdate:currentdate
            }); 

            AdFilterPriceTier.findOne({filter_type : req.body.filter_type} , function(err , object)
            {
                if(object)
                {
                  return  res.send({status : 0 , msg : "this filter-type record existed"});
                }
                else
                {    
                    adFilterPriceTier.save(function(err){
                        if(err)
                       return res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        else
                       return res.send(JSON.stringify({ status : 1 , msg : "filter-type insert successfully." , data :adFilterPriceTier}));
                    })
                }
            });
        }
    })
};

exports.get_filterprice =  function (req, res)
{
    
    AdFilterPriceTier.find({}, function (err, adFilterPriceTier) {
            if (err)
            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
            else
            {
                //console.log(JSON.stringify(country, null, 2));
                if(JSON.stringify(adFilterPriceTier, null, 2).length > 2)
                res.send(JSON.stringify({ status : 1 , msg : "price-tier listed successfully." , data :adFilterPriceTier}));
                else
                res.send(JSON.stringify({ status : 0 , msg : "no price-tier found."}));
            }
            
        });
    
};

exports.update_filterprice = function (req, res) 
{
    //console.log(JSON.stringify(req.body, null, 2));
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
            AdFilterPriceTier.findByIdAndUpdate(req.body.id, {$set: req.body}, function (err, adFilterPriceTier) 
            {
                if (err) 
               return res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                else
               return res.send(JSON.stringify({ status : 1 , msg : "price-tier updated successfully."}));
            });
        }
    })
};

exports.update_filter_freevalues = function (req, res) 
{
    //console.log(JSON.stringify(req.body, null, 2));
   // var fr_ids = JSON.stringify(req.body.free_values)
    //console.log(fr_ids);
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
            AdFilterPriceTier.findByIdAndUpdate(req.body.id, {$set: { free_values: req.body.free_values}}, function (err, adFilterPriceTier) 
            {
                if (err) 
              return  res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                else
              return  res.send(JSON.stringify({ status : 1 , msg : "price-tier updated successfully."}));
            });
        }
    })
};