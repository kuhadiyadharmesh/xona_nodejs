const Referral_system = require('../models/referral_system.model')
const CommonFile = require('../constant')

exports.getReferral_System = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
            Referral_system.find({},function(err , referral_system){
                if(err)
                {
                   return res.send({status : 0 , msg : err})
                }
                else
                {
                   return res.send({status: 1 , msg : "List successfylly get .", data : referral_system})
                }
            })
        }
    })
}

exports.update_Referral_system = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
            Referral_system.findOneAndUpdate({_id : req.body.id , level_type:req.body.level_type}, {$set : req.body}, function(err , referral_system){
                if(referral_system)
                {
                  return  res.send({status : 1 , msg : "updated successfully .", data : referral_system})
                }
                else
                {
                   return res.send({status : 0 , msg : "Something gone wrong ."})
                }
            })
        }
    })
}