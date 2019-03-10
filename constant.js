const User = require('./models/user.model');
const FileterPrice = require('./models/adFilterPriceTier.model');
const AdPriceTier = require('./models/adPriceTier.model');
ObjectId = require('mongodb').ObjectID;
const AdMaster = require('./models/adMaster.model');
const Wallet = require('./models/auser_wallet.model');
const Admin_config = require('./models/admin_config.model');
const Coupon = require('./models/coupon.model')
const Admin_user = require('./models/admin_user.model')
var Request = require("request");

var c_success = 200 , c_badrequest = 400,c_auauthorized = 401 , c_forbidden = 403, c_notfound = 404,c_tomany = 429 , c_interserror= 500;
var token_not_in_header = "require header Authorization.";
//var salt = "wRJSrXksZs" , udf5="123456" , key="KbPrcfsk" , payumoney_header ="jecrV8VhjvJUn1U8A3p6xovpwzMHoAbc6oCtWrsXiBw=" ;
var salt = "bCaMZCrVvC" , udf5="123456" , key="8syOxiVG" , payumoney_header ="6yLlRQakR+B7jlO61x+r7amgImdun2sGHW17i9QhuqM==" ;
var self = module.exports = 
{
    c_success,c_badrequest,c_auauthorized,c_forbidden ,c_notfound,c_tomany,c_interserror,
    token_not_in_header , salt , udf5 ,key,payumoney_header,
    admin_auth: function(token , callback)
    {
        if(token != "")
        {
            Admin_user.findOne( {  token :  token }, function(err, adminUser)
            {
                if (adminUser)
                callback(null, true)
                else 
                callback(new Error('Authorization failed.').message)
                });
        }
        else
        callback(new Error('Authorization failed.').message)
        
    },
    admin_auth_withData: function(token , callback)
    {
        if(token != "")
        {
            Admin_user.findOne( {  token :  token }, function(err, adminUser)
            {
                if (adminUser)
                callback(null, adminUser)
                else 
                callback(new Error('Authorization failed.').message)
                });
        }
        else
        callback(new Error('Authorization failed.').message)
        
    },
    check_auth: function (token ,callback) 
    {
        if(token != "")
        {
            User.findOne( {  token :  token }, function(err, user)
            {
                if (user)
                callback(null, true)
                else 
                callback(new Error('Authorization failed.').message)
                });
        }
        else
        callback(new Error('Authorization failed.').message)
    },
    check_authWithData: function (token ,callback) {
        if(token != "")
        {
            User.findOne( {  token :  token }, function(err, user)
            {
            if (user)
            callback(null, user)
            else 
            callback(new Error('Authorization failed.').message)
        });
        }
        else
        callback(new Error('Authorization failed.').message)
    },
    check_authWithId: function (token ,callback) {
        if(token != "")
        {
            User.findOne( {  token :  token }, function(err, user)
            {
            if (user)
            callback(null, user._id)
            else 
            callback(new Error('Authorization failed.').message)
        });
        }
        else
        callback(new Error('Authorization failed.').message)
    },
    check_authWithData_tax: function (token ,callback) {
        
        if(token != "")
        {
            User.findOne( {  token :  token }, function(err, user)
            {
            if (user)
            {
                Admin_config.find({group : 1},function(err , admin_config)
            {
                if(err){}
                else
                {
                    let tax_rate = 0;
                    admin_config.forEach(function(element){
                        tax_rate = tax_rate +  element.value;
                    })
                    let ret_val = JSON.parse(JSON.stringify({"user_id":user._id,"wallet_balance":user.wallet_balance,"tax_arr_data":admin_config,"tax_rate" :tax_rate}))
                    callback(null, ret_val)
                }
            })
                
            }
            else 
            callback(new Error('Authorization failed.').message)
            });
        }
        else
        {
            callback(new Error('Authorization failed.').message)
        }
    },
    get_advertise_userByid : function(id , callback){
        User.findOne({_id: id}, function(err , userdata){
            if(err)
            {
                callback(new Error("Advertiser User not found."))
            }
            else
            {
                callback(null , userdata)
            }
        })
    },
    send_otp : function(mobile_no , OTP  , callback)
    {
        let otp = "";

        if(OTP == "")
        otp = Math.floor(100000 + Math.random() * 900000);
        else
        otp = OTP ;
        
        let url = "http://psms.hakimisolution.com/submitsms.jsp?user=xonain&key=8b7dbc8290XX&mobile="+mobile_no+"&message=XONA%20:%20"+otp+"%20is%20your%20verification%20code.%20Do%20not%20share%20this%20code%20with%20anyone.&senderid=XONAIN&accusage=1"
        console.log(url)
        Request.get(url, (error, response, body) => {
            if(error) 
            {
                //return console.dir(error);
                callback(error.message)
            }
            else
            {
                callback(null , otp)
            }
        });
        

        //callback(null , otp)
    },
    send_otp1 : function(mobile_no , OTP  , callback)
    {
        let otp = "";

        if(OTP == "")
        otp = Math.floor(100000 + Math.random() * 900000);
        else
        otp = OTP ;
        //<#> Your Xona OTP is: 140539 16Uu0/99Rt9
        let url = "http://psms.hakimisolution.com/submitsms.jsp?user=xonain&key=8b7dbc8290XX&mobile="+mobile_no+"&message=<%23>%20Your%20Xona%20OTP%20is:%20"+otp+"%2016Uu0/99Rt9&senderid=XONAIN&accusage=1"
        console.log(url)
        Request.get(url, (error, response, body) => {
            if(error) 
            {
                //return console.dir(error);
                callback(error.message)
            }
            else
            {
                callback(null , otp)
            }
        });
        

        //callback(null , otp)
    },
    calculate_applied_filter : function(ids , filter_ar , callback)
      {

          let ar_str = ids.split(",");
          let ar_num = [];
          ar_str.forEach(function(element) 
          {
            ar_num.push(parseInt(element));
            });
        let amt = 0;
        console.log(filter_ar)
        console.log('-------------------')
        console.log(ar_num)
        

        console.log('-------------------')
       
            FileterPrice.find({"filter_type" : {"$in" : ar_num }},function(err , adfilterpricetire)
            {
                if(err)
                {
                    callback(err.message)
                }
                else 
                {
                    
                    console.log(adfilterpricetire);
                    let arr = null;
                    for(d in adfilterpricetire)
                    {
                        let json_filter = JSON.parse(JSON.stringify(adfilterpricetire[d]));
                        switch (json_filter.filter_type)
                        {
                            case 1:
                            arr = filter_ar.age;
                            break;
                            case 2:
                            arr = filter_ar.gender;
                            break;
                            case 3:
                            arr = filter_ar.pincode;
                            break;
                            case 4:
                            arr = filter_ar.country;
                            break;
                            case 5:
                            arr = filter_ar.state;
                            break;
                            case 6:
                            arr = filter_ar.city;
                            break;
                            case 7:
                            arr = filter_ar.interest;
                            break;
                            case 8:
                            arr = filter_ar.relation;
                            break;
                            case 9:
                            arr = filter_ar.occupation;
                            break;
                            case 10:
                            arr = filter_ar.income;
                            break;
                            case 11:
                            arr = filter_ar.education;
                            break;
                            case 12:
                            arr = filter_ar.religion;
                            break;
                            case 13:
                            arr = filter_ar.familyMember;
                            break;
                        }
                        
                        

                        let add_price = false ;
                        console.log(arr)
                        if(json_filter.free_values != "")
                        {
                            let ar_str = (json_filter.free_values).split(",");
                            if(arr.lenght == 0 || arr.includes(null))
                            {
                                callback(new Error('filter value should not blank.').message)
                            }
                            else
                            {
                                arr.forEach(function(element)
                                {
                                    if(ar_str.includes(element))
                                    {
                                        console.log(element)
                                    }
                                    else
                                    {
                                        add_price = true
                                    }
                                })   
                            }
                           
                        }
                        else
                        {
                            add_price = true;
                        }
                        
                        if(add_price)
                        {
                            
                            amt = amt + json_filter.filter_amt;
                            console.log('------------------')
                            console.log('price include')
                            console.log(json_filter.filter_type);
                            console.log(json_filter.filter_amt);
                            console.log('------------------')
                            //console.log(amt)
                        }
                        else
                        {
                            console.log('------------------')
                            console.log('price not include')
                            console.log(json_filter.filter_type);
                            //console.log(json_filter.filter_amt);
                            console.log('------------------')
                        }
                    }
                     
                    //console.log(amt);
                    callback(null,amt)
                }

                    
            })



      //  });
        //callback(null,10)
        
        /*
        FileterPrice.find({"filter_type" : {"$in" : ar_num }},function(err , object)
        {
            if(err){callback(err.message)}
            else 
            {let amt = 0;
                for(d in object)
                { amt = amt + JSON.parse(JSON.stringify(object[d])).filter_amt;}callback(null,amt)
            }
        })
        */
      },
    get_adPrice_tier : function(ad_typeid , callback)
      {
        AdPriceTier.find({ad_type : ad_typeid}, function (err, adPriceTier) {
            if (err)
            callback(err.message)//res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
            else
            {
                //console.log(adPriceTier[0])
                callback(null,JSON.parse(JSON.stringify(adPriceTier[0])))
            }
            
        })
      },
    wallat_balance_charge: function(djson , callback)
      {
          console.log(djson)
          //JSON.stringify({user_id:user_id,type: 1,c_type:c_type,update_amount:update_amount,c_type_id:c_type_id ,  , old_balance:old_balance}
          let current_date = new Date();
          let json = JSON.parse(djson);
          let new_balance = 0

          let ad_amount_after_bonus = json.amount - json.bonus_amount ;

          if(json.type == 1)
          new_balance = json.old_balance + json.amount
          else
          new_balance = json.old_balance - ad_amount_after_bonus
      
        //   let c_tyepe_iddd = ""
        //   if(json.c_type_id == ""){}
        //   else
        //   c_tyepe_iddd  = details_id: new ObjectId(json.c_type_id),


          //console.log(djson);
          let wallet = new Wallet({
              user_id : new ObjectId(json.user_id),
              wallet_type:json.type,// 1 for credit 2 for debit
              details_type: json.c_type,// credit ( 1 for online , 2 for delete(refund) , 3 for admin) , debit (1 for adpost)
              // credit (Online table_id , Refund (advertise id ) , debit (advertise id)
              old_balance:json.old_balance,
              new_balance:new_balance,
              amount:ad_amount_after_bonus,
              status_msg:"",
              cdate:current_date
          })

          if(json.c_type_id == "" || json.c_type_id == undefined){}
          else
          wallet["details_id"] = new ObjectId(json.c_type_id)
          
          wallet.save(function(err)
          {
              if(err){
                  console.log(err);
                  callback(new Error("wallet table save err").message)
                  //Wallet.findByIdAndRemove({_id : wallet._id},function(err){});
                  
              }
              else
              {
                  
                  let w_id = wallet._id;
                  //console.log(w_id);
                  User.findByIdAndUpdate(json.user_id,{$set : {wallet_balance:new_balance , wallet_last_id: new ObjectId(w_id) , update_date:current_date}},function(err,user){
                      if(err)
                      {
                          //console.log(err.message)
                          callback(new Error("User table update err").message)
                      }
                      else
                      {
                          //console.log(true);
                         
                          if(json.c_type_id != "" )// payment add
                          {
                            //AdMaster.
                            if(json.type == 1)// credit 
                            {
                                callback(null, true)
                            }
                            else 
                            if(json.type == 2)// debit
                            {
                                
                                // update Admaster Advertise Payment status & 
                                AdMaster.findByIdAndUpdate(json.c_type_id ,{$set :{pay_status : 1 , pay_from:json.pay_from , is_coupon :json.is_coupon , coupon_code:json.coupon_code , coupon_amt : json.bonus_amount, final_amount: ad_amount_after_bonus }},function(err ,object){if(err){}else
                                {
                                    // ad master payment status updated
                                    if(json.is_coupon)
                                    {
                                      let final_total_used = json.total_used + 1 ;
                                        Coupon.findOneAndUpdate({coupon_code : json.coupon_code},{$set : {total_used: final_total_used}},function(err)
                                        {
                                            callback(null, true)
                                        });
                                    }
                                    else
                                    callback(null, true)
                                }})
                            }
                          }
                          else
                          {
                            callback(null, true)
                          }
                      }
      
                  })
              }
          })
          
      },
    getAdMaster_allData :function(id , pay_status , callback){
        console.log(id);
        AdMaster.findOne( {  _id :  id , pay_status : pay_status }, function(err, adMaster)
        {
          if (adMaster)
          {
            //console.log(adMaster)
            callback(null, adMaster)
          }
          else 
          {
              //console.log(err)
            callback(new Error('no ad found.').message)
          }
         
      });
    },
    payment_charge1 : function(req_data , callback)
    {
        //console.log(req_data)
        let data = req_data
       // console.log('ooooooooooooooooooooooooooooooooooooooooooooo')
       // console.log(data);
        let token = data.token
       // console.log(token)
      //  console.log('ooooooooooooooooooooooooooooooooooooooooooooo')
    self.check_authWithData(token , (error , value) =>
    {
        if(error)
        {
            callback(error.message)
            //return res.send(JSON.stringify({ status : 0 , msg : error}));
        }
        else
        {
            //let data = req.body;
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
                self.getAdMaster_allData(c_type_id , 0 , (error ,addata)=>
                {
                    if (addata)
                    {
                        //callback(error.message)
                        //return res.send(JSON.stringify({ status : 0 , msg : error}));
                    
                    console.log('-----------------------------------')
                    console.log(addata)
                    console.log(addata.final_amount)
                    console.log(charge_amount)
                    console.log(old_balance)///{"is_partial":1,"advertise_id":"5c02e99b0c279016fc623184","c_type":1,"old_balance":155,"amount":"55.719"}
                    console.log(value.wallet_balance)
                    console.log('-----------------------------------')
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
                                    callback("Coupon not valid.")
                                   // res.send({status: 0,msg :"Coupon not valid."})
                                }
                                else
                                {
                                    let couponData = arr_couponData[0];
                                    self.getAdMaster_allData(c_type_id , 0 , (err , adData)=>
                                    {
                                        if(err){  callback(err.message)}
                                        else
                                        {
                                            let allow = false ;
                                            let res_dat = null;
                                            let msg = "coupon code not valid .";
                                            self.couponCount_Userwise(user_id , couponData.coupon , (err , user_per_count)=>
                                            {
                                                if(err)
                                                {
                                                    console.log(3);
                                                    msg = "error in count for per user.";
                                                }
                                                else
                                                {
                                                    self.coupon_validation_check(couponData,adData,user_per_count,(err , res_data)=>
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
                                                    callback(msg)
                                                   // res.send(JSON.stringify({status:0 ,msg : msg}))
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
                                                            //res.send({status:0,msg:err})
                                                            callback(err.msg)
                                                        }
                                                        else
                                                        {
                                                            callback(null," Successfully charged , your add will live soon.")
                                                            //res.send({status:1,msg:" Successfully charged , your add will live soon."})
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
                            callback(err.msg)//res.send({status:0,msg:err})
                        }
                        else
                        {
                            callback(null," Successfully charged , your add will live soon.")// res.send({status:1,msg:" Successfully charged , your add will live soon."})
                        }
                    });
                }
                else
                return callback("advertise not found or it already paid. ")

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
                self.getAdMaster_allData(c_type_id , 0 , (error ,addata)=>
                {
                    if (addata)
                    {
                        //res.send(JSON.stringify({ status : 0 , msg : error}));
                    
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
                            if(err){ callback(err.message)}
                            else
                            {
                                if(arr_couponData.length == 0)
                                {
                                    callback(new Error("Coupon not valid.").message)//res.send({status: 0,msg :"Coupon not valid."})
                                }
                                else
                                {
                                    let couponData = arr_couponData[0];
                                    self.getAdMaster_allData(c_type_id , 0 , (err , adData)=>
                                    {
                                        if(err){ callback(err.message)//return res.status(200).send({status:0 ,msg : err}
                                        }
                                        else
                                        {
                                            let allow = false ;
                                            let res_dat = null;
                                            let msg = "coupon code not valid .";
                                            self.couponCount_Userwise(user_id , couponData.coupon , (err , user_per_count)=>
                                            {
                                                if(err)
                                                {
                                                    console.log(3);
                                                    msg = "error in count for per user.";
                                                }
                                                else
                                                {
                                                    self.coupon_validation_check(couponData,adData,user_per_count,(err , res_data)=>
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
                                                    callback(msg)
                                                   // res.send(JSON.stringify({status:0 ,msg : msg}))
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
                                                            callback(err.message)
                                                            //res.send({status:0,msg:err})
                                                        }
                                                        else
                                                        {   callback(null," Successfully charged , your add will live soon.")
                                                            //res.send({status:1,msg:" Successfully charged , your add will live soon."})
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
                            callback(err.message)
                        }
                        else
                        {
                            callback(null," Successfully charged , your add will live soon.")
                        }
                    });
                 }
                 else
                 return callback("advertise not found or it already paid. ")

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

                console.log(value)
                self.getAdMaster_allData(c_type_id , 0 , (error ,addata)=>
                {
                    if (addata)
                    {
                        //return res.send(JSON.stringify({ status : 0 , msg : error}));
                    
                    
                    console.log('----------------------------------')
                    console.log(addata)
                    console.log(addata.final_amount)
                    console.log(charge_amount)
                    console.log(old_balance)///{"is_partial":1,"advertise_id":"5c02e99b0c279016fc623184","c_type":1,"old_balance":155,"amount":"55.719"}
                    console.log(value.wallet_balance)
                    console.log('----------------------------------')
                    if(is_coupon)
                    {
                        // validation coupon
                        console.log(coupon_id)
                        Coupon.find({_id:coupon_id,is_active:true, is_expire:false},function(err , arr_couponData)
                        {
                            if(err){ callback(err.message)}
                            else
                            {
                                if(arr_couponData.length == 0)
                                {
                                    callback(new Error("Coupon not valid.").message)//res.send({status: 0,msg :"Coupon not valid."})
                                }
                                else
                                {
                                    let couponData = arr_couponData[0];
                                    self.getAdMaster_allData(c_type_id , 0 , (err , adData)=>
                                    {
                                        if(err){  callback(err.message)}
                                        else
                                        {
                                            let allow = false ;
                                            let res_dat = null;
                                            let msg = "coupon code not valid .";
                                            self.couponCount_Userwise(user_id , couponData.coupon , (err , user_per_count)=>
                                            {
                                                if(err)
                                                {
                                                    console.log(3);
                                                    msg = "error in count for per user.";
                                                }
                                                else
                                                {
                                                    self.coupon_validation_check(couponData,adData,user_per_count,(err , res_data)=>
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
                                                    callback(msg)//res.send(JSON.stringify({status:0 ,msg : msg}))
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
                                                            callback(err.message)//res.send({status:0,msg:err})
                                                        }
                                                        else
                                                        {
                                                            callback(null," Successfully charged , your add will live soon.")//res.send({status:1,msg:" Successfully charged , your add will live soon."})
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
                        //console.log(value)
                       // console.log(err)
                        if(err)
                        {
                            callback(err.message)
                        }
                        else
                        {
                            callback(null," Successfully charged , your add will live soon.")
                        }
                    });
                    
                    }
                    else
                    {
                        callback("advertise not found or it already paid.")
                    }

                })
            }
            else
            {
                // parameter missing

            }
        }
            
          
        
        
    })
    }
    ,   
    couponCount_Userwise : function(id , coupon_code , callback)
    {
        
        
            AdMaster.count({advertiser_id:id , is_coupon : true , coupon_code : coupon_code},function(err,cou)
                {if (err) {callback(err.message)} else {callback(   null,cou)}
                 })
       
        
       //callback(null , 5)
    },
    couponCount_TotalUser : function(coupon_code , callback)
    {
        //callback(null , 5)
        
        /*
        AdMaster.count({ is_coupon : true , coupon_code : coupon_code},function(err,cou)
        {if (err) {callback(err.message)} else {callback(null,cou)}
        })
        */

    },
    coupon_validation_check : function(couponData, adData , user_per_count,callback)
    {
       
        
                        //let couponData = arr_couponData[0];
                       
                                // check ad type 
                                // check amount , greter or less 
                                //
                                //console.log(couponData);
                                let arr_adtype = JSON.parse(JSON.stringify(couponData.ad_types))
                                //console.log(adData.adtype_id);
                                //console.log(arr_adtype);
                                //console.log(arr_adtype.includes(parseInt(adData.adtype_id)))
    
                                let allow = false ;
                                let msg = "coupon code not valid .";
    
                                
                                        if(arr_adtype.includes(parseInt(adData.adtype_id)))// adtype_id validation 
                                        {
                                            // 3 conditions here
                                            //let op = 
                                            //let valid = false ;
                                            //console.log(couponData.ad_amount_type)
                                            //console.log(couponData.ad_amount)
                                        // console.log(adData.final_amount)
                                            //console.log((couponData.ad_amount_type == -1 && couponData.ad_amount >= adData.final_amount ));
                                            if((couponData.ad_amount_type == 1 && couponData.ad_amount <= adData.final_amount) || (couponData.ad_amount_type == -1 && couponData.ad_amount >= adData.final_amount ) )// Greter then adamount = 990 and limit 1000
                                            {
                                                //valid = true
                                                
                                                if((couponData.filter_amount_type == 1 && couponData.filter_amount <= adData.final_filter_amount ) || (couponData.filter_amount_type == -1 && couponData.filter_amount > adData.final_filter_amount ))
                                                {
                                                    console.log(1);
                                                    if((couponData.target_user_type == 1 && couponData.target_user <= adData.totaluser_for_ads ) || (couponData.target_user_type == -1 && couponData.target_user > adData.totaluser_for_ads ))
                                                    {
    
                                                        console.log(2);
                                                        if(user_per_count <  couponData.per_user_limit)// 10 < 10
                                                        {
                                                            console.log(7);
                                                            if(couponData.total_used < couponData.max_use)
                                                            {console.log(8);
                                                                allow = true 
                                                            }
                                                            else
                                                            {console.log(9);
                                                                msg = "coupon not valid , coupon total limit finish.";
                                                            }
                                                        }
                                                        else
                                                        {
                                                            console.log(10);
                                                                    msg = "coupon not valid , coupon user limit finish.";
                                                        }
                                                    }
                                                    else
                                                    {console.log(11);
                                                        msg = "coupon not valid , this target audience not in validation";    
                                                    }
                                                }
                                                else
                                                {console.log(12);
                                                    msg = "coupon not valid , this ad filter amount not in validation.";    
                                                }
                                            }
                                            else
                                            {console.log(13);
                                                msg = "coupon not valid , this ad total amount not in validation.";
                                            }
                                        
    
                                        }
                                    
    
                                    if(!allow)
                                    {   console.log(14);
                                        //res.send(JSON.stringify({status:0 ,msg : msg}))
                                        callback(new Error(msg).message);
                                    }
                                    else
                                    {   console.log(15);
                                        callback(null,JSON.stringify({status : 1 , msg : "list got ", data: {"coupan_id":couponData._id,"discount_value": couponData.discount_value, "discount_type":couponData.discount_type}}))
                                        //res.send(JSON.stringify({status : 1 , msg : "list got ", data: {"coupan_id":couponData._id,"discount_value": couponData.discount_value, "discount_type":couponData.discount_type}}))
                                    }
                                
                        
                         
                    
               
           
        }
  };

  function XXX(addata,charge_amount,old_balance,value,user_id,c_type,c_type_id,is_coupon,coupon_code,bonus_amount,userd_count, callback)
{
    console.log(addata.final_amount)
    console.log(charge_amount)
    console.log(old_balance)
    console.log(value.wallet_balance)
    if(addata.final_amount == charge_amount && roundToTwo(old_balance) == roundToTwo(value.wallet_balance))
                    {
                        if(value.wallet_balance >= (charge_amount - bonus_amount))//  bonus amount minus kariu
                        {
                            //console.log('--------------i--------------')
                           // console.log(JSON.stringify({user_id:user_id,type: 2,c_type:c_type,amount:charge_amount,c_type_id:c_type_id ,pay_from: 1, old_balance:old_balance , is_coupon : is_coupon , coupon_code : coupon_code , bonus_amount :bonus_amount , total_used : userd_count}))
                           // console.log('----------------------------')
                            self.wallat_balance_charge(JSON.stringify({user_id:user_id,type: 2,c_type:c_type,amount:charge_amount,c_type_id:c_type_id ,pay_from: 1, old_balance:old_balance , is_coupon : is_coupon , coupon_code : coupon_code , bonus_amount :bonus_amount , total_used : userd_count}),(error, value) =>
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
                            console.log('---------------err -------------')
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
/*consn.check_auth(req.headers.token , (error, value) =>
   {
    if (error) 
    {
        //console.log(error);
    }
    else
    {
        console.log(value);
    }
       // return callback(null, value);
    });
  */