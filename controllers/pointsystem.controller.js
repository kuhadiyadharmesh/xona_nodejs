const Point_System = require('../models/pointsystem.model')
const CommonFile = require('../constant')

exports.getall_pointsystem = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , is_right)=>{
        if(err)
        {
           return res.status(401).send({status : 0 , msg : err})
        }else
        {
            Point_System.find({},function(err , pointsystem){
                if(err)
                {
                   return res.send({status:0,msg : err.message})
                }
                else
                {
                   return res.send({status: 1 , msg : "point system listed", data : pointsystem})
                }
            })
        }
    })
}

exports.update_pointsystem = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , is_right)=>{
        if(err)
        {
          return  res.status(401).send({status : 0 , msg : err})
        }else
        {
            //let type = req.body.type 
            //let _id = req.body.id
            //let points = req.body.points
            Point_System.findOneAndUpdate({_id:req.body.id , type : req.body.type }, {$set :req.body},function(err , pointsystem){
                if(err)
                {
                  return  res.send({status:0,msg : err.message})
                }
                else
                {
                  return  res.send({status : 1 , msg : "point system updated successfully .", data : pointsystem})//res.send({status: 1 , msg : "point system listed", data : pointsystem})
                }
            })
        }
    })
}