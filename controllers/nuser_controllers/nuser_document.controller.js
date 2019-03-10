const UserDocument = require('../../models/nuser_model/nuser_Document.model')
const NCommonFile = require('../../nconstant.js')

exports.add_document = function(req , res)
{
    console.log(req.headers.token)
    NCommonFile.nuser_check_authWithData(req.headers.token ,(err , userData )=>
    {
        if(err){
            res.send({status : 0 ,msg : err})
        }
        else
        {
            UserDocument.findOne({user_id : userData._id},function(err , userdocument)
            {
                console.log(userdocument)
                
                    if(userdocument)
                    {
                        // update 
                        UserDocument.findByIdAndUpdate(userdocument._id,{$set : req.body}, function(req , userdoc)
                        {
                            if(err)(res.send({status : 0 ,msg : err.message}))
                            else
                            {
                                res.send({status : 1 ,msg : "Document updated successfully ." })
                            }
                        })
                    }
                    else
                    {
                        // insert
                        let cdate = new Date();
                        let userdocument = new UserDocument({
                            user_id : userData._id,
                            f_adhar:req.body.f_adhar,
                            b_adhar:req.body.b_adhar,
                            pan_card : req.body.pan_card,
                            f_passport : req.body.f_passport,
                            b_passport : req.body.b_passport,
                            f_election : req.body.f_election,
                            b_election : req.body.b_election,
                            f_licence : req.body.f_licence,
                            b_licence : req.body.b_licence,
                            others : req.body.others,
                            create_date : cdate ,
                            update_date : cdate
                        })

                        userdocument.save(function(err)
                        {
                            if(err)
                            {
                                res.send({status : 0 ,msg : err.message})
                            }
                            else
                            {
                                res.send({status : 1 ,msg : "Document inserted successfully ." })
                            }
                        })

                    }
                
            })
        }
    })
}

exports.get_document = function(req , res)
{
    NCommonFile.nuser_check_authWithData(req.headers.token ,(err , userData )=>
    {
        if(err)
        {
            res.send({status : 0 ,msg : err.message})
        }
        else
        {
            UserDocument.findOne({user_id : userData._id},function(err , userdocument)
            {
                if(userdocument)
                {
                    res.send({status : 1 ,msg : "Document listed successfully .", data: userdocument })
                }
                else
                {
                    res.send({status : 0 ,msg : "no data found."})
                }
            })
        }
    })
}