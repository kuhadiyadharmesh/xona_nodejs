const Wallet = require('../models/auser_wallet.model');
const CommonFile = require('../constant');
const Wallet_controller = require('../controllers/auser_wallet.controller');
const Coupon  = require('../models/coupon.model')



exports.payment_charge = function(req , res)
{
    console.log(req.body)
    CommonFile.check_authWithData(req.headers.token , (error , value) =>
    {
        if(error)
        {
            return res.status(401).send(JSON.stringify({ status : 0 , msg : error}));
        }
        else
        {
            let data = req.body;
            let is_coupon = data.is_coupon;// true // false 
            let coupon_id = data.coupon_id;
            
            if(data.is_partial == 1)// 1 only wallet
            {
                let user_id = value._id;
                let c_type = data.c_type //1 for online , 2 for admin add , 3 for refund from ad.// 1 for from ad.
                let charge_amount = data.amount ;//55.719
                let c_type_id = data.advertise_id ;//ad id 
                let old_balance = data.old_balance;//155
                let bonus_amount = 0; 

                console.log(data)
                CommonFile.getAdMaster_allData(c_type_id , 0 , (error ,addata)=>
                {
                    if (error)
                    {
                        return res.send(JSON.stringify({ status : 0 , msg : error}));
                    }
                    console.log(addata)
                    console.log(addata.final_amount)
                    console.log(charge_amount)
                    console.log(old_balance)///{"is_partial":1,"advertise_id":"5c02e99b0c279016fc623184","c_type":1,"old_balance":155,"amount":"55.719"}
                    console.log(value.wallet_balance)
                    if(is_coupon)
                    {
                        // validation coupon
                        console.log(coupon_id)
                        Coupon.find({_id:coupon_id,is_active:true, is_expire:false},function(err , arr_couponData)
                        {
                            if(err){ res.send({status: 0,msg :error})}
                            else
                            {
                                if(arr_couponData.length == 0)
                                {
                                    res.send({status: 0,msg :"Coupon not valid."})
                                }
                                else
                                {
                                    let couponData = arr_couponData[0];
                                    CommonFile.getAdMaster_allData(c_type_id , 0 , (err , adData)=>
                                    {
                                        if(err){ return res.status(200).send({status:0 ,msg : err})}
                                        else
                                        {
                                            let allow = false ;
                                            let res_dat = null;
                                            let msg = "coupon code not valid .";
                                            CommonFile.couponCount_Userwise(user_id , couponData.coupon , (err , user_per_count)=>
                                            {
                                                if(err)
                                                {
                                                    console.log(3);
                                                    msg = "error in count for per user.";
                                                }
                                                else
                                                {
                                                    CommonFile.coupon_validation_check(couponData,adData,user_per_count,(err , res_data)=>
                                                    {
                                                        if(err)
                                                        {
                                                            msg = err;
                                                        }
                                                        else
                                                        {
                                                            allow = true ;
                                                            res_dat = res_data;
                                                        }
                                                    })
                                                
                                                }
                
                                                if(!allow)
                                                {   console.log(14);
                                                    res.send(JSON.stringify({status:0 ,msg : msg}))
                                                }
                                                else
                                                {console.log(15);
                                                    
                                                    if(couponData.discount_type = 1)// amount
                                                     bonus_amount = couponData.discount_value;
                                                    else
                                                    if(couponData.discount_type = 1)//  %
                                                    {
                                                        bonus_amount = (adData.final_amount) * (couponData.discount_value) / 100 
                                                    }

                                                    XXX(addata,charge_amount,old_balance,value,user_id,c_type,c_type_id,true,couponData.coupon_code,bonus_amount,couponData.total_used, (err , value)=>
                                                    {
                                                        if(err)
                                                        {
                                                            res.send({status:0,msg:err})
                                                        }
                                                        else
                                                        {
                                                            res.send({status:1,msg:" Successfully charged , your add will live soon."})
                                                        }
                                                    })//res.send(JSON.stringify({status : 1 , msg : "list got ", data: {"coupan_id":couponData._id,"discount_value": couponData.discount_value, "discount_type":couponData.discount_type}}))
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                    else
                    XXX(addata,charge_amount,old_balance,value,user_id,c_type,c_type_id,false,"",0,-1,(err , value)=>
                    {
                        if(err)
                        {
                            res.send({status:0,msg:err})
                        }
                        else
                        {
                            res.send({status:1,msg:" Successfully charged , your add will live soon."})
                        }
                    });
                    

                })
            }
            if(data.is_partial == 2) // 2 only  online 
            {
                let user_id = value._id;
                let c_type = 1 //1 for online , 2 for admin add , 3 for refund from ad.// 1 for from ad.
                let charge_amount = data.amount ;//55.719
                let c_type_id = data.advertise_id ;//ad id 
                let old_balance = data.old_balance;//155
                let bonus_amount = 0; 

                console.log(data)
                CommonFile.getAdMaster_allData(c_type_id , 0 , (error ,addata)=>
                {
                    if (error)
                    {
                        return res.send(JSON.stringify({ status : 0 , msg : error}));
                    }
                    console.log(addata)
                    console.log(addata.final_amount)
                    console.log(charge_amount)
                    console.log(old_balance)///{"is_partial":1,"advertise_id":"5c02e99b0c279016fc623184","c_type":1,"old_balance":155,"amount":"55.719"}
                    console.log(value.wallet_balance)
                    if(is_coupon)
                    {
                        // validation coupon
                        console.log(coupon_id)
                        Coupon.find({_id:coupon_id,is_active:true, is_expire:false},function(err , arr_couponData)
                        {
                            if(err){ res.send({status: 0,msg :error})}
                            else
                            {
                                if(arr_couponData.length == 0)
                                {
                                    res.send({status: 0,msg :"Coupon not valid."})
                                }
                                else
                                {
                                    let couponData = arr_couponData[0];
                                    CommonFile.getAdMaster_allData(c_type_id , 0 , (err , adData)=>
                                    {
                                        if(err){ return res.status(200).send({status:0 ,msg : err})}
                                        else
                                        {
                                            let allow = false ;
                                            let res_dat = null;
                                            let msg = "coupon code not valid .";
                                            CommonFile.couponCount_Userwise(user_id , couponData.coupon , (err , user_per_count)=>
                                            {
                                                if(err)
                                                {
                                                    console.log(3);
                                                    msg = "error in count for per user.";
                                                }
                                                else
                                                {
                                                    CommonFile.coupon_validation_check(couponData,adData,user_per_count,(err , res_data)=>
                                                    {
                                                        if(err)
                                                        {
                                                            msg = err;
                                                        }
                                                        else
                                                        {
                                                            allow = true ;
                                                            res_dat = res_data;
                                                        }
                                                    })
                                                
                                                }
                
                                                if(!allow)
                                                {   console.log(14);
                                                    res.send(JSON.stringify({status:0 ,msg : msg}))
                                                }
                                                else
                                                {console.log(15);
                                                    
                                                    if(couponData.discount_type = 1)// amount
                                                     bonus_amount = couponData.discount_value;
                                                    else
                                                    if(couponData.discount_type = 1)//  %
                                                    {
                                                        bonus_amount = (adData.final_amount) * (couponData.discount_value) / 100 
                                                    }

                                                    XXX(addata,charge_amount,old_balance,value,user_id,c_type,c_type_id,true,couponData.coupon_code,bonus_amount,couponData.total_used, (err , value)=>
                                                    {
                                                        if(err)
                                                        {
                                                            res.send({status:0,msg:err})
                                                        }
                                                        else
                                                        {
                                                            res.send({status:1,msg:" Successfully charged , your add will live soon."})
                                                        }
                                                    })//res.send(JSON.stringify({status : 1 , msg : "list got ", data: {"coupan_id":couponData._id,"discount_value": couponData.discount_value, "discount_type":couponData.discount_type}}))
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                    else
                    XXX(addata,charge_amount,old_balance,value,user_id,c_type,c_type_id,false,"",0,-1,(err , value)=>
                    {
                        if(err)
                        {
                            res.send({status:0,msg:err})
                        }
                        else
                        {
                            res.send({status:1,msg:" Successfully charged , your add will live soon."})
                        }
                    });
                    

                })
            }
            else
            if(data.is_partial == 3) //(online + wallet)
            {
                let user_id = value._id;
                let c_type = 1 //1 for online , 2 for admin add , 3 for refund from ad.// 1 for from ad.
                let charge_amount = data.amount ;//55.719
                let c_type_id = data.advertise_id ;//ad id 
                let old_balance = data.old_balance;//155
                let bonus_amount = 0; 

                console.log(data)
                CommonFile.getAdMaster_allData(c_type_id , 0 , (error ,addata)=>
                {
                    if (error)
                    {
                        return res.send(JSON.stringify({ status : 0 , msg : error}));
                    }
                    console.log(addata)
                    console.log(addata.final_amount)
                    console.log(charge_amount)
                    console.log(old_balance)///{"is_partial":1,"advertise_id":"5c02e99b0c279016fc623184","c_type":1,"old_balance":155,"amount":"55.719"}
                    console.log(value.wallet_balance)
                    if(is_coupon)
                    {
                        // validation coupon
                        console.log(coupon_id)
                        Coupon.find({_id:coupon_id,is_active:true, is_expire:false},function(err , arr_couponData)
                        {
                            if(err){ res.send({status: 0,msg :error})}
                            else
                            {
                                if(arr_couponData.length == 0)
                                {
                                    res.send({status: 0,msg :"Coupon not valid."})
                                }
                                else
                                {
                                    let couponData = arr_couponData[0];
                                    CommonFile.getAdMaster_allData(c_type_id , 0 , (err , adData)=>
                                    {
                                        if(err){ return res.status(200).send({status:0 ,msg : err})}
                                        else
                                        {
                                            let allow = false ;
                                            let res_dat = null;
                                            let msg = "coupon code not valid .";
                                            CommonFile.couponCount_Userwise(user_id , couponData.coupon , (err , user_per_count)=>
                                            {
                                                if(err)
                                                {
                                                    console.log(3);
                                                    msg = "error in count for per user.";
                                                }
                                                else
                                                {
                                                    CommonFile.coupon_validation_check(couponData,adData,user_per_count,(err , res_data)=>
                                                    {
                                                        if(err)
                                                        {
                                                            msg = err;
                                                        }
                                                        else
                                                        {
                                                            allow = true ;
                                                            res_dat = res_data;
                                                        }
                                                    })
                                                
                                                }
                
                                                if(!allow)
                                                {   console.log(14);
                                                    res.send(JSON.stringify({status:0 ,msg : msg}))
                                                }
                                                else
                                                {console.log(15);
                                                    
                                                    if(couponData.discount_type = 1)// amount
                                                     bonus_amount = couponData.discount_value;
                                                    else
                                                    if(couponData.discount_type = 1)//  %
                                                    {
                                                        bonus_amount = (adData.final_amount) * (couponData.discount_value) / 100 
                                                    }

                                                    XXX(addata,charge_amount,old_balance,value,user_id,c_type,c_type_id,true,couponData.coupon_code,bonus_amount,couponData.total_used, (err , value)=>
                                                    {
                                                        if(err)
                                                        {
                                                            res.send({status:0,msg:err})
                                                        }
                                                        else
                                                        {
                                                            res.send({status:1,msg:" Successfully charged , your add will live soon."})
                                                        }
                                                    })//res.send(JSON.stringify({status : 1 , msg : "list got ", data: {"coupan_id":couponData._id,"discount_value": couponData.discount_value, "discount_type":couponData.discount_type}}))
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                    else
                    XXX(addata,charge_amount,old_balance,value,user_id,c_type,c_type_id,false,"",0,-1,(err , value)=>
                    {
                        if(err)
                        {
                            res.send({status:0,msg:err})
                        }
                        else
                        {
                            res.send({status:1,msg:" Successfully charged , your add will live soon."})
                        }
                    });
                    

                })
            }
            else
            {
                // parameter missing

            }
        }
            
          
        
        
    })
}



function XXX(addata,charge_amount,old_balance,value,user_id,c_type,c_type_id,is_coupon,coupon_code,bonus_amount,userd_count, callback)
{
    console.log(addata.final_amount)
    console.log(charge_amount)
    console.log(old_balance)
    console.log(value.wallet_balance)
    if(addata.final_amount == charge_amount && old_balance == roundToTwo(value.wallet_balance))
                    {
                        if(value.wallet_balance >= (charge_amount - bonus_amount))//  bonus amount minus kariu
                        {
                            CommonFile.wallat_balance_charge(JSON.stringify({user_id:user_id,type: 2,c_type:c_type,amount:charge_amount,c_type_id:c_type_id ,pay_from: 1, old_balance:old_balance , is_coupon : is_coupon , coupon_code : coupon_code , bonus_amount :bonus_amount , total_used : userd_count}),(error, value) =>
                            {
                                if(error)
                                {
                                    callback(error)//res.send({status: 0,msg :error})
                                }
                                else
                                {
                                    // coupon code update , 
                                    //res.send({status:1,msg:" Successfully charged , your add will live soon."})
                                    callback(null , "Successfully charged , your advertise will live soon.");
                                }
                            })
                        }
                        else
                        {
                            // insufficient balance
                            callback(new Error("insufficient balance").message)
                            //res.send({status: 0,msg :"insufficient balance"})
                        }
                    }
                    else
                    {
                        callback(new Error("Balance not matched with data.").message)
                       // res.send({status: 0,msg :"Balance not matched with data."})
                    }
}
function roundToTwo(num) {    
    return +(Math.round(num + "e+3")  + "e-3");
}