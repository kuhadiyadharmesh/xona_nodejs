const AUser = require('./models/nuser_model/nuser.model')
const PointSystem = require('./models/pointsystem.model')
const Admin_config = require('./models/admin_config.model')
const AdShow_History = require('./models/nuser_model/adshow_history.model')
const Referel_System = require('./models/referral_system.model')
const NUser_Wallet = require('./models/nuser_wallet.model')
const NUser_BankDetails = require('./models/nuser_model/nuser_bankdetails.model')

var obj = module.exports =
{
    nuser_check_auth : function (token ,callback) 
    {
        if(token != "")
        {
            AUser.findOne( {  token :  token }, function(err, auser)
            {
                if (auser)
                callback(null, true)
                else 
                callback(new Error('Authorization failed.').message)
                });
        }
        else
        callback(new Error('Authorization failed.').message)
    },
    nuser_check_authWithData : function (token ,callback) {

        if(token != "")
        {
            AUser.findOne( {  token :  token }, function(err, auser)
            {
            if (auser)
            callback(null, auser)
            else 
            callback(new Error('Authorization failed.').message)
            });
        }
        else
        callback(new Error('Authorization failed.').message)
    },
    nuser_check_profile : function(token , is_bank,callback){
        if(token != "")
        {
            AUser.findOne( {  token :  token }, function(err, auser)
            {
                if (auser)
                {
                    callback(null, 100)
                    /*
                    if(is_bank == 2)
                        callback(null, 100)
                    else
                    {
                        NUser_BankDetails.findOne({nuser_id :auser._id},function(errs , bankData){
                            if(err)
                            {
                                callback(new Error('Bank Details not found.').message)
                            }
                            else
                            {
                                callback(null, 100)
                            }
                        })
                    }
                    */
                }
                else 
                    callback(new Error('Authorization failed.').message)
                });
        }
        else
        callback(new Error('Authorization failed.').message)
    }
    ,
    withdraw_point_validation : function(points , callback)
    {
        Admin_config.find({$or : [{group :  2},{group : 3}]}, function(err , withdraw_condition)
        {
            if(withdraw_condition.length == 5)
            {
                let point_to_point = 0
                let point_to_money = 0
                let auto_withdraw_time  = 0;
                let withdraw_charge = 0; 
                let min_value = 0;
                let max_value = 0;
                withdraw_condition.forEach(element =>{
                    if(element.group == 2)
                    {
                        point_to_point = element.points
                        point_to_money = element.value
                    }
                    else
                    {
                        if(element.type == 1)
                        {
                            auto_withdraw_time = element.value
                        }
                        else if(element.type == 2)
                        {
                            min_value = element.value
                        }
                        else if(element.type == 3)
                        {
                            max_value = element.value
                        }
                        else if(element.type == 4)
                        {
                            withdraw_charge = element.value
                        }
                    }
                })

                let amount = (point_to_money * points) / point_to_point

                if(amount < min_value)// 1 < 10
                {
                    callback(new Error("minimum point should be "+point_to_point).message)
                }
                else if (amount > max_value)
                {
                    let max_points = ((amount / point_to_money) * point_to_point)
                    callback(new Error("maximum point should be "+max_points+" for withdraw.").message)
                }
                else
                {
                   
                    callback(null , {point_to:point_to_point , money_to : point_to_money , charge : withdraw_charge})
                }


            }
            else
            {
                callback(new Error("Contact xona support to config withdraw data."))
            }
        })
    }
    ,
    point_system  : function(type , callback){

        PointSystem.findOne({type : type},function(err , pointsystem)
        {
            if(pointsystem)
            {
                callback(null ,pointsystem);
            }
            else
            {
                callback(new Error("Point System not found.").message)
            }
        })
    },
    nuser_getupper_level :function(user_id , callback)
    {
        //NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>{
            AUser.findOne({_id : user_id},function(err , nuserData){
            //console.log(nuserData)
            if(err)
            {
                //res.send({status : 0 , msg : err})
                callback(new Error("user not found !!.").message)
            }
            else
            {
                var referral_code = nuserData.referral_code
                let res_data = [];
                if(referral_code == undefined)
                {
                    callback(null,res_data)
                    return ""
                }
                //return  res.send({status:1 , msg : "your team listed successfully.",data :[]})
    
                console.log(referral_code)
                
                AUser.findOne({myCode : referral_code},function(err , upfirst)
                {
                    //console.log(upfirst)
                    if(upfirst)
                    {
                        referral_code = upfirst.referral_code
                        res_data.push(upfirst)
                        if(referral_code == undefined)
                        {
                            callback(null,res_data)
                            return ""
                        }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                       // console.log(referral_code)
                        AUser.findOne({myCode : referral_code},function(err , upsecond){
                            if(upsecond)
                            {
                                referral_code = upsecond.referral_code
                                res_data.push(upsecond)
                                if(referral_code == undefined)
                                {
                                    callback(null,res_data)
                                    return ""
                                }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                
                               // console.log(referral_code)
                                AUser.findOne({myCode : referral_code},function(err , upthird){
                                    if(upthird)
                                    {
                                        referral_code = upthird.referral_code
                                        res_data.push(upthird)
                                        if(referral_code == undefined)
                                        {
                                            callback(null,res_data)
                                            return ""
                                        }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
            
                                        
            
                                        AUser.findOne({myCode : referral_code},function(err , upforth){
                                            if(upforth)
                                            {
                                                referral_code = upforth.referral_code
                                                res_data.push(upforth)
                                                if(referral_code == undefined)
                                                {
                                                    callback(null,res_data)
                                                    return ""
                                                }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                    
                                                
                                                
                    
                                                AUser.findOne({myCode : referral_code},function(err , upfifth){
                                                    if(upfifth)
                                                    {
                                                        referral_code = upfifth.referral_code
                                                        res_data.push(upfifth)
                                                        if(referral_code == undefined)
                                                        {
                                                            callback(null,res_data)
                                                            return ""
                                                        }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                            
                                                        
                                                        
                            
                                                        AUser.findOne({myCode : referral_code},function(err , upsixth){
                                                            if(upsixth)
                                                            {
                                                                referral_code = upsixth.referral_code
                                                                res_data.push(upsixth)
                                                                if(referral_code == undefined)
                                                                {
                                                                    callback(null,res_data)
                                                                    return ""
                                                                }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                    
                                                                
                                                                
                                    
                                                                AUser.findOne({myCode : referral_code},function(err , upseventh){
                                                                    if(upseventh)
                                                                    { res_data.push(upseventh)
                                                                        referral_code = upseventh.referral_code
                                                                        if(referral_code == undefined)
                                                                        {
                                                                            callback(null,res_data)
                                                                            return ""
                                                                        }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                            
                                                                        
                                            
                                                                        AUser.findOne({myCode : referral_code},function(err , upeightth){
                                                                            if(upeightth)
                                                                            {
                                                                                res_data.push(upeightth)
                                                                                referral_code = upeightth.referral_code
                                                                                if(referral_code == undefined)
                                                                                {
                                                                                    callback(null,res_data)
                                                                                    return ""
                                                                                }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                    
                                                                                
                                                                                
                                                    
                                                                                AUser.findOne({myCode : referral_code},function(err , upnineth){
                                                                                    if(upnineth)
                                                                                    {
                                                                                        res_data.push(upnineth)
                                                                                        referral_code = upnineth.referral_code
                                                                                        if(referral_code == undefined)
                                                                                        {
                                                                                            callback(null,res_data)
                                                                                            return ""
                                                                                        }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                            
                                                                                        
                                                                                        
                                                            
                                                                                        AUser.findOne({myCode : referral_code},function(err , uptenth){
                                                                                            if(uptenth)
                                                                                            {
                                                                                                referral_code = uptenth.referral_code
                                                                                                if(referral_code == undefined)
                                                                                                {
                                                                                                    callback(null,res_data)
                                                                                                    return ""
                                                                                                }//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                    
                                                                                                res_data.push(uptenth)
                                                                                                
                                                                    
                                                                                                callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                            }
                                                                                            else
                                                                                            callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                        })
                                                                                    }
                                                                                    else
                                                                                    callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                })
                                                                            }
                                                                            else
                                                                            callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                        })
                                                                    }
                                                                    else
                                                                    callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                })
                                                            }
                                                            else
                                                            callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                        })
                                                    }
                                                    else
                                                    callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                })
                                            }
                                            else
                                            callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                        })
                                    }
                                    else
                                    callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                })
                            }
                            else
                            callback(null,res_data)//return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                        })
                    }
                    else
                    callback(null,res_data)//res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                })
            }
        })
    }
    ,
    pay_refrel_temparary : function(history_ids ,user_id)
    {
        let ddt = new Date()
        AdShow_History.find({nuser_id : user_id , _id :{$in : history_ids.map(ObjectID)}},function(err ,adshow_history)
        //AdShow_History.findOne({nuser_id : user_id , _id : new ObjectId(history_ids)},function(err ,adshow_history)
        {
            //console.log(adshow_history.length)
            if(err)
            return ""
            if(adshow_history)
            {
                Referel_System.find({},function(err , refereldata){
                    if(err)
                    {
                        console.log('error in get level for reference ')
                    }
                    else
                    {

                        console.log(" user id ---"+user_id)
                        obj.nuser_getupper_level(user_id , (err , level_data)=>
                        {
                            //if(level_data)
                            let total_level = level_data.length
                            console.log(" total_level --"+total_level)

                                    if(total_level > 0)
                                    {
                                    adshow_history.forEach(element =>
                                        {
                                           let points = element.points
                                                for(let i = 0 ; i<total_level ; i = i + 1)
                                                {
                                                    console.log(points)
                                                    console.log('plus value of i = '+ (i + 1))
                                                    let valid_percent = (refereldata.find(o => o.level_type === (i + 1))).level_value
                                                    console.log('valid_precent '+valid_percent+' on Level '+(i + 1))
                                                    
                                                    let f_point =  (points * valid_percent)/ 100
                                                    
                                                    let wallet = new NUser_Wallet({
                                                        user_id :level_data[i]._id,
                                                        wallet_type:1,// 1 for credit 2 for debit
                                                        details_type:2,// credit ( 1 for advertise self, 2 for advetise referel, 3 for bonus , 4 refund(withdrow reject)), debit (1 for withdrow)
                                                        advertise_type : -2 ,// ad type 1 for banner , 2 for half banner , 3 for full screen 
                                                        details_id: element._id,// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                                        old_point:f_point,
                                                        new_point:f_point,
                                                        point:f_point,
                                                        ispoint_temp :1,
                                                        level_point : (i + 1),
                                                        status_msg:"referel points temparary",
                                                        cdate:ddt
                                                    })
                                                    wallet.save(function(err , walletdata)
                                                    {
                                                        //console.log(walletdata)
                                                        if(err)
                                                        {
                                                            //-- wallet activity remaining point
                                                            
                                                            console.log(err+'wallet save error -- user_id--'+level_data[i]._id)
                                                        }
                                                        else
                                                        {
                                                            console.log('balance update user_id'+level_data[i]._id)
                                                        }
                                                    })
                                                    
                                                }
                                        })
                                    }
                                        else
                                            {
                                                console.log('upper level not available. --'+level_data)
                                            }
                        })
/*
                        adshow_history.forEach(element =>{// 4 times
                            obj.nuser_getupper_level(user_id,(err , level_data)=>{// get levels  max 10 ( right now 2)
                                if(err)
                                {
                                    console.log('error in get level of users -- user_id')
                                }
                                else
                                {
                                    let total_level = level_data.length
                                    if(total_level > 0)
                                    {
                                        let points = element.points
                                        for(let i = 0 ; i<total_level ; i = i + 1)
                                        {
                                            console.log(points)
                                            console.log('plus value of i = '+ (i + 1))
                                            let valid_percent = (refereldata.find(o => o.level_type === (i + 1))).level_value
                                            //console.log('valid_precent '+valid_percent)
                                            
                                            let f_point =  (points * valid_percent)/ 100

                                            let user_temp_point = level_data[i].point_temp_balance
                                            if(user_temp_point == undefined)
                                            user_temp_point = 0

                                            console.log('referel Point '+f_point)
                                            console.log('valid_precent '+valid_percent)
                                            console.log('new point ---'+(f_point + user_temp_point))
                                            
                                            
                                            let wallet = new NUser_Wallet({
                                                user_id :level_data[i]._id,
                                                wallet_type:1,// 1 for credit 2 for debit
                                                details_type:2,// credit ( 1 for advertise self, 2 for advetise referel, 3 for bonus , 4 refund(withdrow reject)), debit (1 for withdrow)
                                                advertise_type : -2 ,// ad type 1 for banner , 2 for half banner , 3 for full screen 
                                                details_id: element._id,// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                                old_point:user_temp_point,
                                                new_point:(f_point + user_temp_point),
                                                point:f_point,
                                                ispoint_temp :1,
                                                status_msg:"referel points temparary",
                                                cdate:ddt
                                            })
                                            wallet.save(function(err , walletdata)
                                            {
                                                console.log(walletdata)
                                                if(err)
                                                {
                                                    //-- wallet activity remaining point
                                                    
                                                    console.log(err+'wallet save error -- user_id--'+level_data[i]._id)
                                                }
                                                else
                                                {
                                                    AUser.findOneAndUpdate({_id : level_data[i]._id},{$set : {point_temp_balance : (f_point + user_temp_point)}},function(err , nuserupdate){
                                                        if(err)
                                                        {
                                                            // error in update balance
                                                            console.log('balance update error for -- user_id'+level_data[i]._id)
                                                        }
                                                        else
                                                        {
                                                            // -- wallet balance updated
                                                            console.log('balance update user_id'+level_data[i]._id)
                                                        }
                                                    })
                                                }
                                            })
                                            
                                        }
                                    }
                                    else
                                    {
                                        console.log('upper level not available. --'+level_data)
                                    }
                                    //console.log('print from 318 --'+level_data)
                                    //return "";
                                    
                                    
                                    //console.log('adshow points Point '+points)
                                    
                                }
                            })
                        })*/
                        
                        ///console.log(adshow_history[0])
                        
                               /* let element = adshow_history
                                obj.nuser_getupper_level(user_id,(err , level_data)=>{// get levels  max 10 ( right now 2)
                                    if(err)
                                    {
                                        console.log('error in get level of users -- user_id')
                                    }
                                    else
                                    {
                                        let total_level = level_data.length
                                        if(total_level > 0)
                                        {
                                            let points = element.points
                                            for(let i = 0 ; i<total_level ; i = i + 1)
                                            {
                                                console.log(points)
                                                console.log('plus value of i = '+ (i + 1))
                                                let valid_percent = (refereldata.find(o => o.level_type === (i + 1))).level_value
                                                //console.log('valid_precent '+valid_percent)
                                                
                                                let f_point =  (points * valid_percent)/ 100
    
                                                let user_temp_point = level_data[i].point_temp_balance
                                                if(user_temp_point == undefined)
                                                user_temp_point = 0
    
                                                console.log('referel Point '+f_point)
                                                console.log('valid_precent '+valid_percent)
                                                console.log('new point ---'+(f_point + user_temp_point))
                                                
                                                
                                                let wallet = new NUser_Wallet({
                                                    user_id :level_data[i]._id,
                                                    wallet_type:1,// 1 for credit 2 for debit
                                                    details_type:2,// credit ( 1 for advertise self, 2 for advetise referel, 3 for bonus , 4 refund(withdrow reject)), debit (1 for withdrow)
                                                    advertise_type : -2 ,// ad type 1 for banner , 2 for half banner , 3 for full screen 
                                                    details_id: element._id,// credit (Online table_id , Refund (advertise id ) , debit (advertise id)
                                                    old_point:user_temp_point,
                                                    new_point:(f_point + user_temp_point),
                                                    point:f_point,
                                                    ispoint_temp :1,
                                                    status_msg:"referel points temparary",
                                                    cdate:ddt
                                                })
                                                wallet.save(function(err , walletdata)
                                                {
                                                    console.log(walletdata)
                                                    if(err)
                                                    {
                                                        //-- wallet activity remaining point
                                                        
                                                        console.log(err+'wallet save error -- user_id--'+level_data[i]._id)
                                                    }
                                                    else
                                                    {
                                                        AUser.findOneAndUpdate({_id : level_data[i]._id},{$set : {point_temp_balance : (f_point + user_temp_point)}},function(err , nuserupdate){
                                                            if(err)
                                                            {
                                                                // error in update balance
                                                                console.log('balance update error for -- user_id'+level_data[i]._id)
                                                                
                                                            }
                                                            else
                                                            {
                                                                // -- wallet balance updated
                                                                console.log('balance update user_id'+level_data[i]._id)
                                                                //if(i<total_level)
                                                               // j = j + 1
                                                            }
                                                        })
                                                    }
                                                })
                                                
                                            }
                                        }
                                        else
                                        {
                                            console.log('upper level not available. --'+level_data)
                                        }
                                        //console.log('print from 318 --'+level_data)
                                        //return "";
                                        
                                        
                                        //console.log('adshow points Point '+points)
                                        
                                    }
                                })*/
                        //    }
                        

                      
                        
                    }
                })
            }
            else
            {
                console.log('error in get AdShow_History '+history_ids)
            }
        })
    },
    send_notification : function(nuseData , title , desc)
    {
        
    }
}