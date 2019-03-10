const Transaction = require('../models/atransaction.model')
var Request = require("request");
const AUser = require('../models/user.model')
const CommonFile = require('../constant')
const adMaster = require('../models/adMaster.model')
const Auser_Wallet = require('../models/auser_wallet.model')
//const Payment_FIle = require('../controllers/payment.controller')

var bodyParser = require('body-parser');
var crypto = require('crypto');

exports.create_payment = function(req , res)
{
    console.log(req.headers.token)
    CommonFile.check_authWithData(req.headers.token , (err , userData)=>{
        if(err)
        {
          return res.status(401).send({status : 0 , msg : err}) 
        }
        else
        {
            if(req.body.provider_id == 1)// payumoney
            {
                //amount
                //provider 
                //amount
                //pinfo
                //advertise_id
                /*
                 let is_coupon = data.is_coupon;// true // false 
                 let coupon_id = data.coupon_id;
                */
                var ord = JSON.stringify(Math.random()*100);
                var i = ord.indexOf('.');
                ord = 'TXT'+ (new Date().getTime())+ '' +ord.substr(0,i);


                let pinfo = JSON.stringify({"advertise_id":req.body.advertise_id,"mobile_number" : userData.mobile_number,_id:userData._id ,is_partial : req.body.is_partial, is_coupon : req.body.is_coupon , coupon_id : req.body.coupon_id})
                //let mobile_ = (req.body.mobile_number)
                
                var data = req.body//JSON.parse(strdat);
                var cryp = crypto.createHash('sha512');
                var text = CommonFile.key+'|'+ord+'|'+data.amount+'|'+pinfo+'|'+userData.first_name+'|'+userData.email+'|||||'+CommonFile.udf5+'||||||'+CommonFile.salt;
                console.log(text)
                cryp.update(text);
                var hash = cryp.digest('hex');	
                let cdate = new Date();
                let transaction = new Transaction({
                    user_id :userData._id,
                    advertise_id : req.body.advertise_id,
                    //wallet_id :{type: Schema.Types.ObjectId,ref: 'walletid'},
                    service_provider:1,// 1 for payumoney // 2 for paypal // 3 for ccavenue
                    order_id : ord,// txt id 
                    service_provider_data:hash,
                    amt_topaid :data.amount,
                    provider_status:1,// 1 for initialis , 2 success , 3 for faild , 4 for cancel 
                    credit_status:false ,
                    create_date : cdate , 
                    update_date : cdate
                })
                transaction.save(function(err , transaction){
                    if(err)
                    {
                      return  res.send({status : 0 , msg : err.message})
                    }
                    else
                    {
                       return res.send({status : 1 , data: { hash:hash , txnid : ord , productinfo : pinfo , amount : data.amount , key :CommonFile.key , extra : transaction , udf5 : CommonFile.udf5 }})
                    }
                })
           }
        }
    })
}

exports.verify_payment = function(req , res)
{
    console.log(req.body)
    var key = req.body.key;
	var salt = CommonFile.salt//req.body.salt;
	var txnid = req.body.txnid;
	var amount = req.body.amount;
	var productinfo = req.body.productinfo;
	var firstname = req.body.firstname;
	var email = req.body.email;
	var udf5 = req.body.udf5;
	var mihpayid = req.body.mihpayid;
	var status = req.body.status;
	var resphash = req.body.hash;
	
    var keyString 		=  	key+'|'+txnid+'|'+amount+'|'+productinfo+'|'+firstname+'|'+email+'|||||'+udf5+'|||||';
    //console.log(keyString)
	var keyArray 		= 	keyString.split('|');
	var reverseKeyArray	= 	keyArray.reverse();
	var reverseKeyString=	salt+'|'+status+'|'+reverseKeyArray.join('|');
	//console.log(reverseKeyString)
	var cryp = crypto.createHash('sha512');	
	cryp.update(reverseKeyString);
    var calchash = cryp.digest('hex');
    
    if(calchash == resphash)
    {
        // need to check each and everything.
        let pinfo = JSON.parse(productinfo);
        let advertise_id = pinfo.advertise_id ;
        let user_id = pinfo._id;
        let is_partial = 3//pinfo.is_partial;
        // pinfo.is_coupon;

        console.log(txnid)
        console.log(pinfo)
        console.log(user_id)
        
        //res.send({status : 1 , msg : "payment matched.",data :mihpayid})
       
        let datee = new Date();
       CommonFile.check_authWithData(req.headers.token , (err , userData) =>
       {
           if(err)
           {
              return res.status(401).send({status : 0 , msg : err})
           }
            else
            {
                if(userData._id == user_id)
                {
                    let dstatus = 0;
                    if(req.body.txnStatus == "SUCCESS")
                        dstatus = 2 // succuess
                    else
                        dstatus = 3 // faild

                       // console.log({user_id : user_id , advertise_id : advertise_id , order_id : txnid})
                        //console.log({provider_status : dstatus , provider_payload:req.body ,credit_status : true , update_date: datee})

                    Transaction.findOneAndUpdate({user_id : new ObjectId(user_id) , advertise_id :  new ObjectId(advertise_id) , order_id : txnid} , {$set : {provider_status : dstatus ,credit_status : true }}, function(err ,transaction)
                   // Transaction.findOne({user_id : new ObjectId(user_id) , advertise_id :  new ObjectId(advertise_id) , order_id : txnid} , function(err,transaction)
                    {
                        console.log(transaction)
                        if(transaction)
                        {
                            let old_balance = userData.wallet_balance 
                            let new_balance = old_balance + transaction.amt_topaid
                            let amount = transaction.amt_topaid
                            
                             console.log(amount);
                             console.log(new_balance);
                             console.log(old_balance);
                            let wallet = new Auser_Wallet({
                                user_id : user_id,
                                wallet_type:1,// 1 for credit 2 for debit
                                details_type: 1,// credit ( 1 for online , 2 for delete(refund) , 3 for admin) , debit (1 for adpost)
                                details_id: transaction._id,//new ObjectId(json.c_type_id),// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                old_balance:old_balance,
                                new_balance:new_balance,
                                amount:amount,
                                status_msg:"",
                                cdate:datee
                            })
    
                            wallet.save(function(err, wallet){
                                if(err)
                                {
                                  return  res.send({status : 0 , msg : err})
                                }
                                else
                                {
                                    AUser.findOneAndUpdate({ _id : user_id} , {$set : {wallet_balance : wallet.new_balance, update_date : datee}},function(err , auserdata)
                                    {
                                        if(auserdata)
                                        {
                                            adMaster.findOne({_id : advertise_id},function(err , admasterData)
                                            {//"body": JSON.stringify({"is_partial":is_partial,"advertise_id":""+advertise_id+"","c_type":1,"old_balance":auserdata.wallet_balance,"amount":admasterData.final_amount,"is_coupon":pinfo.is_coupon,"coupon_id":""+pinfo.coupon_id+""})
                                                if(admasterData)
                                                {
                                                    //let head = ""+auserdata.token
                                                    //console.log(req.headers)
                                                    //console.log({"is_partial":is_partial,"advertise_id":advertise_id,"c_type":1,"old_balance":auserdata.wallet_balance,"amount":admasterData.final_amount,"is_coupon":false,"coupon_id":""});
                                                    let pdata = JSON.parse(JSON.stringify({token : req.headers.token ,"is_partial":is_partial,"advertise_id":advertise_id,"c_type":1,"old_balance":wallet.new_balance,"amount":admasterData.final_amount,"is_coupon":false,"coupon_id":""}));
                                                    //console.log('------------------------------------')
                                                    //    console.log(pdata)
                                                    //console.log('------------------------------------')
                                                    CommonFile.payment_charge1(pdata , (err , value)=>
                                                    {
                                                        console.log(value)
                                                        if(err)
                                                        {
                                                            console.log(err)
                                                          return  res.send({status : 0 , msg : err})
                                                        }
                                                        else
                                                        {
                                                            console.log(value)
                                                          return  res.send({status : 1 , msg : value})
                                                        }
                                                    })
                                                    /*
                                                    Request.post({
                                                        "headers": req.headers,
                                                        "url": "http://localhost:80/xona/payment_charge",
                                                        "body": JSON.stringify({"is_partial":is_partial,"advertise_id":advertise_id,"c_type":1,"old_balance":auserdata.wallet_balance,"amount":admasterData.final_amount,"is_coupon":false,"coupon_id":""})
                                                    }, (error, response, body) => {
                                                        
                                                        console.log(response)

                                                        if(error) 
                                                        {
                                                            res.send({status : 0 , msg : "error."})
                                                            return console.dir(error);
                                                        }
                                                        
                                                        res.send({status : 1 , msg : "payment matched.",data :mihpayid})
                                                        //console.dir(JSON.parse(body));
                                                    });

                                                    */
                                                    
                                                }
                                                else
                                                {
                                                  return  res.send({status : 0 , msg : err})
                                                }
                                            })
                                        }
                                        else
                                        {
                                           return res.send({status : 0 , msg : err})
                                        }
    
                                    })
                                }
                            })
                        }
                        else
                        {
                          return  res.send({status : 0 , msg : "transaction record missmatch."})
                        }
                        
                    })
                }
                else
                {
                  return  res.send({status : 0 , msg : "user missmatch."})
                }
            }
       })
    }
    else
    {
        res.send({status : 0 , msg : "contact xona support , problem in payment transaction."})
    }
}