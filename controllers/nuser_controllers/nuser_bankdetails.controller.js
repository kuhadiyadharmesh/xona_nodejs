const Bank_Account = require('../../models/nuser_model/nuser_bankdetails.model')
const NCommonFile = require('../../nconstant')
const CommonFile = require('../../constant')
exports.add_bankaccount = function(req , res)
{
    NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>{
        if(err)
        {
            res.send({status :0 , msg : err})
        }
        else
        {
            let ndata = new Date()
            Bank_Account.findOne({nuser_id : nuserData._id},function(err , bank_account1){
                if(bank_account1)
                {
                    res.send({status : 0 , msg : "Bank details already existed . Please update it."})
                }
                else
                {
                    let bank_account = new Bank_Account({
                        nuser_id : nuserData._id,
                        holder_name : req.body.holder_name,
                        account_number : req.body.account_number,
                        bank_ifsc : req.body.bank_ifsc,
                        bank_branch_name : req.body.bank_branch_name,
                        bank_name : req.body.bank_name,
                        account_type : req.body.account_type, // 1 for saving // 2 for current 
                        cdate : ndata,
                        udate : ndata
                    })

                    bank_account.save(function(err , bank_account2){
                        if(err)
                        {
                            res.send({status : 0 , msg : err})
                        }
                        else
                        {
                            res.send({status : 1 , msg : "Bank Account added successfully." , data : bank_account2})
                        }
                    })
                }
            })


            
        }
    })
}

exports.update_bankaccount = function(req , res)
{
    NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>{
        if(err)
        {
            res.send({status : 0 , msg: err})
        }
        else
        {
            Bank_Account.findOneAndUpdate({nuser_id : nuserData._id},{$set : req.body},function(err , update_data){
                if(err)
                {
                    res.send({status : 0 , msg: err})
                }
                else
                {
                    res.send({status : 1 , msg : err})
                }
            })
        }
        
    })
}
exports.get_bankaccount = function(req , res)
{
    if(req.body.type == 2)
    {
        CommonFile.admin_auth(req.headers.token , (err  , value)=>
        {
            if(err)
            {
              return  res.status(401).send({status : 0 , msg : err})
            }
            else
            {
                Bank_Account.findOne({nuser_id : req.body.enduser_id},function(err , bank_account){
                    if(bank_account)
                    {
                       return res.send({status : 1 , msg : "Bank data get successfully .", data : bank_account})
                    }
                    else
                    {
                       return res.send({status : 0 , msg : "Details not found."})
                    }
                }) 
            }
        })
    }
    else
    {
        NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>{
            if(err)
            {
              return  res.status(401).send({status : 0 , msg : err})
               
            }
            else
            {
                Bank_Account.findOne({nuser_id : nuserData._id},function(err , bank_account){
                    if(bank_account)
                    {
                      return  res.send({status : 1 , msg : "Bank data get successfully .", data : bank_account})
                    }
                    else
                    {
                       return res.send({status : 0 , msg : "Details not found."})
                    }
                })
            }
            
        })
    }
    
}