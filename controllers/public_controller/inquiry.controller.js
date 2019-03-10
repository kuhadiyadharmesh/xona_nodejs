const  Inquiry = require('../../models/public_model/inquiry.model')
const CommonFile = require('../../constant')

exports.save_inqury = function(req , res)
{
    let inquiry = new Inquiry({
        full_name: req.body.full_name,
        last_name: req.body.last_name,
        phone_numner: req.body.phone_numner,
        email : req.body.email,
        subject: req.body.subject,
        message: req.body.message
    })
    inquiry.save(function(err , inquiry)
    {
        if(err)
        {
            return res.send({status : 0 , msg : "error in save inqury."})
        }
        else
        {
            return res.send({status : 1 , msg : "Inquiry send successfully , we will contact your soon."})
        }
    })
}

exports.get_all_inqury = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err,value)=>
    {
        if(err)
        {
            res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            Inquiry.find({}, function(err , allinqury){
                if(err)
                {
                    return res.send({status : 0 , msg : err})
                }
                else
                {
                    return res.send({status : 1 , msg : "listed successfully", data : allinqury})
                }
            })
        }
    })
}