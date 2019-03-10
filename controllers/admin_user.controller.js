const Admin_user = require('../models/admin_user.model')
const CommonFile = require('../constant')
var uniqid = require('uniqid');

exports.admin_login = function(req , res)
{
    console.log(req.body)
    Admin_user.findOne({name : req.body.name}, function(err , admin_user)
    {
        if(admin_user)
        {
            console.log(admin_user)
            if(admin_user.password == req.body.password)
            {
                let timestemp = (new Date().getTime())
                let new_token = uniqid('tok-admin-') +''+timestemp

                Admin_user.findOneAndUpdate({_id : admin_user._id},{$set :{token : new_token}},function(err , admindata){
                    if(admindata)
                    {
                        res.send({status : 1 , msg : "Admin Login successfully.",data:{token : new_token}})
                    }
                    else
                    {
                        res.send({status : 0 , msg : "Contact Xona Support."})
                    }
                })
                
            }
            else
            res.send({status : 0 , msg : "password is wrong."})
        }
        else
        {
            res.send({status : 0 , msg : "user not found."})
        }
    })
}
exports.logout = function(req , res)
{
    CommonFile.admin_auth_withData(req.headers.token,function(err , adminData)
    {
        let dd = new Date();
        if(err)
        {
            res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            Admin_user.findOneAndUpdate({_id : adminData._id},{$set : {token : uniqid('tok-admin-')}},(err,admin)=>{
                if(admin)
                {
                    res.send({status : 1 , msg : "Logout successfully."})
                }
            })
        }
    })
}