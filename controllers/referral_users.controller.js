const Nuser = require('../models/nuser_model/nuser.model')
const NCommonFile = require('../nconstant')
const CommonFile = require('../constant')
ObjectID = require('mongodb').ObjectID;

exports.get_my_referralusers = function(req , res)
{
    
    if(req.body.type == 2)
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
               return res.status(401).send({status : 0})
            //else
            Nuser.findOne({_id : req.body.enduser_id , is_approve : 1},function(err , nuserData)
            {
                if(err)
                {
                    res.send({status:0 , msg : err})
                }
                else
                {
                    //let mycode = 
                    if(nuserData)
                    {
                        let res_data = []
                        Nuser.find({referral_code : nuserData.myCode , is_approve : 1},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , firstPersion){
                            //console.log(firstPersion)
                            if(err)
                                res.send({status:0 , msg : err})
                            else
                            {
                                //res.send({status:1 , data : firstPersion}) 
                                if(firstPersion.length == 0)
                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
            
                                res_data.push(firstPersion)
                                let mycodes = []
                                firstPersion.forEach(element =>{
                                    if(element.myCode == undefined){}
                                            else
                                            mycodes.push(element.myCode)
                                })
                                // console.log('--------------level 1 start ----------------------------------')
                                // console.log(mycodes)
                                // console.log('--------------level 1 close-------------------')
                                Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , second)
                                {
                                    //console.log(second)
                                    if(err)
                                    res.send({status:0 , msg : err})
                                    else
                                    {
                                        //res.send({status:1 , data : firstPersion}) 
                                        if(second.length == 0)
                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                    
                                        res_data.push(second)
                                        let mycodes = []
                                        second.forEach(element =>{
                                            if(element.myCode == undefined){}
                                            else
                                            mycodes.push(element.myCode)
                                        })
                                        // console.log('--------------level 2 start ----------------------------------')
                                        // console.log(mycodes)
                                        // console.log('--------------level 2 close-------------------')
                                        Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , third)
                                        {
                                            //console.log(third)
                                            if(err)
                                            res.send({status:0 , msg : err})
                                            else
                                            {
                                                //res.send({status:1 , data : firstPersion}) 
                                                if(third.length == 0)
                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                            
                                                res_data.push(third)
                                                let mycodes = []
                                                third.forEach(element =>{
                                                    if(element.myCode == undefined){}
                                                    else
                                                    {
                                                        mycodes.push(element.myCode)
                                                        console.log(element.myCode)
                                                    }
                                                    
                                                })
                                                // console.log('--------------level 3 start ----------------------------------')
                                                // console.log(mycodes)
                                                // console.log('--------------level 3 close-------------------')
                                            // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                
                                                Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , forth)
                                                {
                                                    if(err)
                                                    res.send({status:0 , msg : err})
                                                    else
                                                    {
                                                        //res.send({status:1 , data : firstPersion}) 
                                                        if(forth.length == 0)
                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                    
                                                        res_data.push(forth)
                                                        let mycodes = []
                                                        forth.forEach(element =>{
                                                            if(element.myCode == undefined){}
                                                            else
                                                            mycodes.push(element.myCode)
                                                        })
                                                        // console.log('--------------level 4 start ----------------------------------')
                                                        // console.log(mycodes)
                                                        // console.log('--------------level 4 close-------------------')
                                                    // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                        
                                                        Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , fifth)
                                                        {
                                                            if(err)
                                                            res.send({status:0 , msg : err})
                                                            else
                                                            {
                                                                //res.send({status:1 , data : firstPersion}) 
                                                                if(fifth.length == 0)
                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                            
                                                                res_data.push(fifth)
                                                                let mycodes = []
                                                                fifth.forEach(element =>{
                                                                    if(element.myCode == undefined){}
                                                                    else
                                                                    mycodes.push(element.myCode)
                                                                })
                                                                // console.log('--------------level 5 start ----------------------------------')
                                                                // console.log(mycodes)
                                                                // console.log('--------------level 5 close-------------------')
                                                            // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                
                                                                Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , sixth)
                                                                {
                                                                    if(err)
                                                                    res.send({status:0 , msg : err})
                                                                    else
                                                                    {
                                                                        //res.send({status:1 , data : firstPersion}) 
                                                                        if(sixth.length == 0)
                                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                    
                                                                        res_data.push(sixth)
                                                                        let mycodes = []
                                                                        sixth.forEach(element =>{
                                                                            if(element.myCode == undefined){}
                                                                            else
                                                                            mycodes.push(element.myCode)
                                                                        })
                                                                        // console.log('--------------level 6 start ----------------------------------')
                                                                        // console.log(mycodes)
                                                                        // console.log('--------------level 6 close-------------------')
                                                                    // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                        
                                                                        Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , seventh)
                                                                        {
                                                                            if(err)
                                                                            res.send({status:0 , msg : err})
                                                                            else
                                                                            {
                                                                                //res.send({status:1 , data : firstPersion}) 
                                                                                if(seventh.length == 0)
                                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                            
                                                                                res_data.push(seventh)
                                                                                let mycodes = []
                                                                                seventh.forEach(element =>{
                                                                                    if(element.myCode == undefined){}
                                                                                    else
                                                                                    mycodes.push(element.myCode)
                                                                                })
                                            
                                                                            // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                
                                                                                Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , eighth)
                                                                                {
                                                                                    if(err)
                                                                                        res.send({status:0 , msg : err})
                                                                                        else
                                                                                        {
                                                                                            //res.send({status:1 , data : firstPersion}) 
                                                                                            if(eighth.length == 0)
                                                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                        
                                                                                            res_data.push(eighth)
                                                                                            let mycodes = []
                                                                                            eighth.forEach(element =>{
                                                                                                if(element.myCode == undefined){}
                                                                                                else
                                                                                                mycodes.push(element.myCode)
                                                                                            })
                                                        
                                                                                        // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                            
                                                                                            Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , ningth)
                                                                                            {
                                                                                                if(err)
                                                                                                res.send({status:0 , msg : err})
                                                                                                else
                                                                                                {
                                                                                                    //res.send({status:1 , data : firstPersion}) 
                                                                                                    if(ningth.length == 0)
                                                                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                
                                                                                                    res_data.push(ningth)
                                                                                                    let mycodes = []
                                                                                                    ningth.forEach(element =>{
                                                                                                        if(element.myCode == undefined){}
                                                                                                        else
                                                                                                        mycodes.push(element.myCode)
                                                                                                    })
                                                                
                                                                                                // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                                    
                                                                                                    Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , ten)
                                                                                                    {
                                                                                                        if(err)
                                                                                                        res.send({status:0 , msg : err})
                                                                                                        else
                                                                                                        {
                                                                                                            //res.send({status:1 , data : firstPersion}) 
                                                                                                            if(ten.length == 0)
                                                                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                        
                                                                                                            res_data.push(ten)
                                                                                                            let mycodes = []
                                                                                                            ten.forEach(element =>{
                                                                                                                if(element.myCode == undefined){}
                                                                                                                else
                                                                                                                mycodes.push(element.myCode)
                                                                                                            })
                                                                        
                                                                                                        res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                                        
                                                                                                        }        
                                                                                                    })
                                                                                                }     
                                                                                            })
                                                                                        }      
                                                                                })
                                                                            }      
                                                                        })
                                                                    }     
                                                                })
                                                            }     
                                                        })
                                                    }  
                                                })
                                            }  
                                        })
                                    }  
                                })
                            }
                        })

                    }
                    else
                    {
                        return  res.send({status:1 , msg : "your team listed successfully.",data :[]}) 
                    }
                
                }
            })
        })
    }
    else
    {
        NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>{
            console.log(nuserData)
            if(err)
            {
                res.send({status:0 , msg : err})
            }
            else
            {
                //let mycode = 
                if(nuserData.is_approve == 1)
                {
                    let res_data = []
                    Nuser.find({referral_code : nuserData.myCode , is_approve : 1},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , firstPersion){
                        //console.log(firstPersion)
                        if(err)
                            res.send({status:0 , msg : err})
                        else
                        {
                            //res.send({status:1 , data : firstPersion}) 
                            if(firstPersion.length == 0)
                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
        
                            res_data.push(firstPersion)
                            let mycodes = []
                            firstPersion.forEach(element =>{
                                if(element.myCode == undefined){}
                                        else
                                        mycodes.push(element.myCode)
                            })
                            // console.log('--------------level 1 start ----------------------------------')
                            // console.log(mycodes)
                            // console.log('--------------level 1 close-------------------')
                            Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , second)
                            {
                                //console.log(second)
                                if(err)
                                res.send({status:0 , msg : err})
                                else
                                {
                                    //res.send({status:1 , data : firstPersion}) 
                                    if(second.length == 0)
                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                
                                    res_data.push(second)
                                    let mycodes = []
                                    second.forEach(element =>{
                                        if(element.myCode == undefined){}
                                        else
                                        mycodes.push(element.myCode)
                                    })
                                    // console.log('--------------level 2 start ----------------------------------')
                                    // console.log(mycodes)
                                    // console.log('--------------level 2 close-------------------')
                                    Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , third)
                                    {
                                        //console.log(third)
                                        if(err)
                                        res.send({status:0 , msg : err})
                                        else
                                        {
                                            //res.send({status:1 , data : firstPersion}) 
                                            if(third.length == 0)
                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                        
                                            res_data.push(third)
                                            let mycodes = []
                                            third.forEach(element =>{
                                                if(element.myCode == undefined){}
                                                else
                                                {
                                                    mycodes.push(element.myCode)
                                                    console.log(element.myCode)
                                                }
                                                
                                            })
                                            // console.log('--------------level 3 start ----------------------------------')
                                            // console.log(mycodes)
                                            // console.log('--------------level 3 close-------------------')
                                        // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                            
                                            Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , forth)
                                            {
                                                if(err)
                                                res.send({status:0 , msg : err})
                                                else
                                                {
                                                    //res.send({status:1 , data : firstPersion}) 
                                                    if(forth.length == 0)
                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                
                                                    res_data.push(forth)
                                                    let mycodes = []
                                                    forth.forEach(element =>{
                                                        if(element.myCode == undefined){}
                                                        else
                                                        mycodes.push(element.myCode)
                                                    })
                                                    // console.log('--------------level 4 start ----------------------------------')
                                                    // console.log(mycodes)
                                                    // console.log('--------------level 4 close-------------------')
                                                // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                    
                                                    Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , fifth)
                                                    {
                                                        if(err)
                                                        res.send({status:0 , msg : err})
                                                        else
                                                        {
                                                            //res.send({status:1 , data : firstPersion}) 
                                                            if(fifth.length == 0)
                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                        
                                                            res_data.push(fifth)
                                                            let mycodes = []
                                                            fifth.forEach(element =>{
                                                                if(element.myCode == undefined){}
                                                                else
                                                                mycodes.push(element.myCode)
                                                            })
                                                            // console.log('--------------level 5 start ----------------------------------')
                                                            // console.log(mycodes)
                                                            // console.log('--------------level 5 close-------------------')
                                                        // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                            
                                                            Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , sixth)
                                                            {
                                                                if(err)
                                                                res.send({status:0 , msg : err})
                                                                else
                                                                {
                                                                    //res.send({status:1 , data : firstPersion}) 
                                                                    if(sixth.length == 0)
                                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                
                                                                    res_data.push(sixth)
                                                                    let mycodes = []
                                                                    sixth.forEach(element =>{
                                                                        if(element.myCode == undefined){}
                                                                        else
                                                                        mycodes.push(element.myCode)
                                                                    })
                                                                    // console.log('--------------level 6 start ----------------------------------')
                                                                    // console.log(mycodes)
                                                                    // console.log('--------------level 6 close-------------------')
                                                                // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                    
                                                                    Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , seventh)
                                                                    {
                                                                        if(err)
                                                                        res.send({status:0 , msg : err})
                                                                        else
                                                                        {
                                                                            //res.send({status:1 , data : firstPersion}) 
                                                                            if(seventh.length == 0)
                                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                        
                                                                            res_data.push(seventh)
                                                                            let mycodes = []
                                                                            seventh.forEach(element =>{
                                                                                if(element.myCode == undefined){}
                                                                                else
                                                                                mycodes.push(element.myCode)
                                                                            })
                                        
                                                                        // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                            
                                                                            Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , eighth)
                                                                            {
                                                                                if(err)
                                                                                    res.send({status:0 , msg : err})
                                                                                    else
                                                                                    {
                                                                                        //res.send({status:1 , data : firstPersion}) 
                                                                                        if(eighth.length == 0)
                                                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                    
                                                                                        res_data.push(eighth)
                                                                                        let mycodes = []
                                                                                        eighth.forEach(element =>{
                                                                                            if(element.myCode == undefined){}
                                                                                            else
                                                                                            mycodes.push(element.myCode)
                                                                                        })
                                                    
                                                                                    // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                        
                                                                                        Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , ningth)
                                                                                        {
                                                                                            if(err)
                                                                                            res.send({status:0 , msg : err})
                                                                                            else
                                                                                            {
                                                                                                //res.send({status:1 , data : firstPersion}) 
                                                                                                if(ningth.length == 0)
                                                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                            
                                                                                                res_data.push(ningth)
                                                                                                let mycodes = []
                                                                                                ningth.forEach(element =>{
                                                                                                    if(element.myCode == undefined){}
                                                                                                    else
                                                                                                    mycodes.push(element.myCode)
                                                                                                })
                                                            
                                                                                            // res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                                
                                                                                                Nuser.find({referral_code :{$in :mycodes}},{token:0,OTP:0,point_balance:0,is_approve:0,is_verify:0,is_active:0,create_date:0,update_date:0},function(err , ten)
                                                                                                {
                                                                                                    if(err)
                                                                                                    res.send({status:0 , msg : err})
                                                                                                    else
                                                                                                    {
                                                                                                        //res.send({status:1 , data : firstPersion}) 
                                                                                                        if(ten.length == 0)
                                                                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                    
                                                                                                        res_data.push(ten)
                                                                                                        let mycodes = []
                                                                                                        ten.forEach(element =>{
                                                                                                            if(element.myCode == undefined){}
                                                                                                            else
                                                                                                            mycodes.push(element.myCode)
                                                                                                        })
                                                                    
                                                                                                    res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                                    
                                                                                                    }        
                                                                                                })
                                                                                            }     
                                                                                        })
                                                                                    }      
                                                                            })
                                                                        }      
                                                                    })
                                                                }     
                                                            })
                                                        }     
                                                    })
                                                }  
                                            })
                                        }  
                                    })
                                }  
                            })
                        }
                    })

                }
                else
                {
                    return  res.send({status:1 , msg : "your team listed successfully.",data :[]}) 
                }
            
            }
        })
    }
}
exports.get_myteam_level_first_level = function(req , res)
{
    if(req.body.type == 2)
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            return res.status(401).send({status : 0})

            let level_user_id = req.body.level_user_id 
            Nuser.findOne({_id : ObjectId(level_user_id)} , function(err , userdata){
                if(userdata)
                {
                    let mycode = userdata.myCode;
                    Nuser.find({referral_code : mycode},function(err , usersdatas)
                    {
                        if(err)
                        {
                           return res.send({status : 0 , msg : err})
                        }
                        else
                        {
                          return res.send({status : 1 , msg : "User listed successfully.",data : usersdatas})
                        }
                    })
                }
                else
                {
                   return res.send({status : 0 , msg : err}) 
                }
            })

        })
    }
    else{
    NCommonFile.nuser_check_auth(req.headers.token , (err , isuser)=>{
        if(err)
        {
            res.send({status : 0 , msg : err})
        }
        else
        {
            let level_user_id = req.body.level_user_id 
            Nuser.findOne({_id : ObjectId(level_user_id)} , function(err , userdata){
                if(userdata)
                {
                    let mycode = userdata.myCode;
                    Nuser.find({referral_code : mycode},function(err , usersdatas)
                    {
                        if(err)
                        {
                            res.send({status : 0 , msg : err})
                        }
                        else
                        {
                            res.send({status : 1 , msg : "User listed successfully.",data : usersdatas})
                        }
                    })
                }
                else
                {
                    res.send({status : 0 , msg : err}) 
                }
            })
        }
    })
    }
}
exports.get_my_upperreferralusers = function(req , res)
{
    if(req.body.type == 2)
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            {
                return res.status(401).send({status : 0 , msg :err})
            }
            else
            {
                Nuser.findOne({_id : req.body.user_id},function(err , nuserData){
                    if(nuserData)
                    {
                        var referral_code = nuserData.referral_code
                        if(referral_code == undefined)
                        return  res.send({status:1 , msg : "your team listed successfully.",data :[]})
            
                        console.log(referral_code)
                        let res_data = [];
                        Nuser.findOne({myCode : referral_code},function(err , upfirst)
                        {
                            console.log(upfirst)
                            if(upfirst)
                            {
                                referral_code = upfirst.referral_code
                                res_data.push(upfirst)
                                if(referral_code == undefined)
                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
            
                                
                                
                                console.log(referral_code)
                                Nuser.findOne({myCode : referral_code},function(err , upsecond){
                                    if(upsecond)
                                    {
                                        referral_code = upsecond.referral_code
                                        res_data.push(upsecond)
                                        if(referral_code == undefined)
                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
            
                                        
                                        
                                        console.log(referral_code)
                                        Nuser.findOne({myCode : referral_code},function(err , upthird){
                                            if(upthird)
                                            {
                                                referral_code = upthird.referral_code
                                                res_data.push(upthird)
                                                if(referral_code == undefined)
                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                    
                                                
                                                
                    
                                                Nuser.findOne({myCode : referral_code},function(err , upforth){
                                                    if(upforth)
                                                    {
                                                        referral_code = upforth.referral_code
                                                        res_data.push(upforth)
                                                        if(referral_code == undefined)
                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                            
                                                        
                                                        
                            
                                                        Nuser.findOne({myCode : referral_code},function(err , upfifth){
                                                            if(upfifth)
                                                            {
                                                                referral_code = upfifth.referral_code
                                                                res_data.push(upfifth)
                                                                if(referral_code == undefined)
                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                    
                                                                
                                                                
                                    
                                                                Nuser.findOne({myCode : referral_code},function(err , upsixth){
                                                                    if(upsixth)
                                                                    {
                                                                        referral_code = upsixth.referral_code
                                                                        res_data.push(upsixth)
                                                                        if(referral_code == undefined)
                                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                            
                                                                        
                                                                        
                                            
                                                                        Nuser.findOne({myCode : referral_code},function(err , upseventh){
                                                                            if(upseventh)
                                                                            { res_data.push(upseventh)
                                                                                referral_code = upseventh.referral_code
                                                                                if(referral_code == undefined)
                                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                    
                                                                                
                                                    
                                                                                Nuser.findOne({myCode : referral_code},function(err , upeightth){
                                                                                    if(upeightth)
                                                                                    {
                                                                                        res_data.push(upeightth)
                                                                                        referral_code = upeightth.referral_code
                                                                                        if(referral_code == undefined)
                                                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                            
                                                                                        
                                                                                        
                                                            
                                                                                        Nuser.findOne({myCode : referral_code},function(err , upnineth){
                                                                                            if(upnineth)
                                                                                            {
                                                                                                res_data.push(upnineth)
                                                                                                referral_code = upnineth.referral_code
                                                                                                if(referral_code == undefined)
                                                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                    
                                                                                                
                                                                                                
                                                                    
                                                                                                Nuser.findOne({myCode : referral_code},function(err , uptenth){
                                                                                                    if(uptenth)
                                                                                                    {
                                                                                                        referral_code = uptenth.referral_code
                                                                                                        if(referral_code == undefined)
                                                                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                            
                                                                                                        res_data.push(uptenth)
                                                                                                        
                                                                            
                                                                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                                    }
                                                                                                    else
                                                                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                                })
                                                                                            }
                                                                                            else
                                                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                        })
                                                                                    }
                                                                                    else
                                                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                })
                                                                            }
                                                                            else
                                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                        })
                                                                    }
                                                                    else
                                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                })
                                                            }
                                                            else
                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                        })
                                                    }
                                                    else
                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                })
                                            }
                                            else
                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                        })
                                    }
                                    else
                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                })
                            }
                            else
                            res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                        })
                    }
                    else
                    {
                        return  res.send({status:1 , msg : "your team listed successfully.",data :[]})
                    }
                })
            }
            
        })
    }
    else
    {
        NCommonFile.nuser_check_authWithData(req.headers.token , (err , nuserData)=>{
            console.log(nuserData)
            if(err)
            {
                res.send({status : 0 , msg : err})
            }
            else
            {
                var referral_code = nuserData.referral_code
                if(referral_code == undefined)
                return  res.send({status:1 , msg : "your team listed successfully.",data :[]})
    
                console.log(referral_code)
                let res_data = [];
                Nuser.findOne({myCode : referral_code},function(err , upfirst)
                {
                    console.log(upfirst)
                    if(upfirst)
                    {
                        referral_code = upfirst.referral_code
                        res_data.push(upfirst)
                        if(referral_code == undefined)
                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
    
                        
                        
                        console.log(referral_code)
                        Nuser.findOne({myCode : referral_code},function(err , upsecond){
                            if(upsecond)
                            {
                                referral_code = upsecond.referral_code
                                res_data.push(upsecond)
                                if(referral_code == undefined)
                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
    
                                
                                
                                console.log(referral_code)
                                Nuser.findOne({myCode : referral_code},function(err , upthird){
                                    if(upthird)
                                    {
                                        referral_code = upthird.referral_code
                                        res_data.push(upthird)
                                        if(referral_code == undefined)
                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
            
                                        
                                        
            
                                        Nuser.findOne({myCode : referral_code},function(err , upforth){
                                            if(upforth)
                                            {
                                                referral_code = upforth.referral_code
                                                res_data.push(upforth)
                                                if(referral_code == undefined)
                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                    
                                                
                                                
                    
                                                Nuser.findOne({myCode : referral_code},function(err , upfifth){
                                                    if(upfifth)
                                                    {
                                                        referral_code = upfifth.referral_code
                                                        res_data.push(upfifth)
                                                        if(referral_code == undefined)
                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                            
                                                        
                                                        
                            
                                                        Nuser.findOne({myCode : referral_code},function(err , upsixth){
                                                            if(upsixth)
                                                            {
                                                                referral_code = upsixth.referral_code
                                                                res_data.push(upsixth)
                                                                if(referral_code == undefined)
                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                    
                                                                
                                                                
                                    
                                                                Nuser.findOne({myCode : referral_code},function(err , upseventh){
                                                                    if(upseventh)
                                                                    { res_data.push(upseventh)
                                                                        referral_code = upseventh.referral_code
                                                                        if(referral_code == undefined)
                                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                            
                                                                        
                                            
                                                                        Nuser.findOne({myCode : referral_code},function(err , upeightth){
                                                                            if(upeightth)
                                                                            {
                                                                                res_data.push(upeightth)
                                                                                referral_code = upeightth.referral_code
                                                                                if(referral_code == undefined)
                                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                    
                                                                                
                                                                                
                                                    
                                                                                Nuser.findOne({myCode : referral_code},function(err , upnineth){
                                                                                    if(upnineth)
                                                                                    {
                                                                                        res_data.push(upnineth)
                                                                                        referral_code = upnineth.referral_code
                                                                                        if(referral_code == undefined)
                                                                                        return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                            
                                                                                        
                                                                                        
                                                            
                                                                                        Nuser.findOne({myCode : referral_code},function(err , uptenth){
                                                                                            if(uptenth)
                                                                                            {
                                                                                                referral_code = uptenth.referral_code
                                                                                                if(referral_code == undefined)
                                                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                    
                                                                                                res_data.push(uptenth)
                                                                                                
                                                                    
                                                                                                return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                            }
                                                                                            else
                                                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                        })
                                                                                    }
                                                                                    else
                                                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                                })
                                                                            }
                                                                            else
                                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                        })
                                                                    }
                                                                    else
                                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                                })
                                                            }
                                                            else
                                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                        })
                                                    }
                                                    else
                                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                                })
                                            }
                                            else
                                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                        })
                                    }
                                    else
                                    return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                                })
                            }
                            else
                            return  res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                        })
                    }
                    else
                    res.send({status:1 , msg : "your team listed successfully.",data :res_data})
                })
            }
        }) 
    }
    
}
