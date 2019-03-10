const Helpdesk = require('../../models/helpdesk_model/helpdesk.model')
const Notification = require('../../models/notification_model/notification.model')
const CommonFile = require('../../constant')
const NCommonFile = require('../../nconstant')
ObjectId = require('mongodb').ObjectID;

exports.send_message = function(req , res)
{
    if(req.body.type == 3)// Admin
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            return res.status(401).send({status : 0 , msg:err})
            else
            {
                let data = req.body
                let user_id = data.user_id
                let subject_type = data.subject_type
                let message_type = data.message_type
                let message = data.message
                let user_type = data.user_type


                let helpdesk = new Helpdesk({
                    subject_type: subject_type, // 1 , 2 ,3,4,5
                    message_type:message_type,// 1 for text , 2 for img
                    message:message,
                    user_type :user_type, // 1 for End user , 2 for Advertiser
                    from:2,// 1 for from user , 2 for admin
                    is_read : false,
                    user_id:user_id,
                    cdate : new Date()
                })
                helpdesk.save(function(err , helpdeskData){
                    if(err)
                    return res.send({status : 0, msg :err})
                    else
                    return res.send({status :1 , msg :"Help desk message sent."})
                })
            }
        })
    }
    else
    if(req.body.type == 2) // Advertise user
    {
        CommonFile.check_authWithData(req.headers.token , (err , valueData)=>
        {
            if(err)
            return res.status(401).send({status : 0 , msg:err})
            else
            {
                let data = req.body
                let user_id = valueData._id
                let subject_type = data.subject_type
                let message_type = data.message_type
                let message = data.message
                //let user_type = data.user_type


                let helpdesk = new Helpdesk({
                    subject_type: subject_type, // 1 , 2 ,3,4,5
                    message_type:message_type,// 1 for text , 2 for img
                    message:message,
                    user_type :2, // 1 for End user , 2 for Advertiser
                    from:1,// 1 for from user , 2 for admin
                    is_read : false,
                    user_id:user_id,
                    cdate : new Date()
                })
                helpdesk.save(function(err , helpdeskData){
                    if(err)
                    return res.send({status : 0, msg :err})
                    else
                    return res.send({status :1 , msg :"Help desk message sent."})
                })
            }
        })
    
    }
    else // END user
    {
        NCommonFile.nuser_check_authWithData(req.headers.token , (err , valueData)=>
        {
            if(err)
            return res.status(401).send({status : 0 , msg:err})
            else
            {
                let data = req.body
                let user_id = valueData._id
                let subject_type = data.subject_type
                let message_type = data.message_type
                let message = data.message
                //let user_type = data.user_type


                let helpdesk = new Helpdesk({
                    subject_type: subject_type, // 1 , 2 ,3,4,5
                    message_type:message_type,// 1 for text , 2 for img
                    message:message,
                    user_type :1, // 1 for End user , 2 for Advertiser
                    from:1,// 1 for from user , 2 for admin
                    is_read : false,
                    user_id:user_id,
                    cdate : new Date()
                })
                helpdesk.save(function(err , helpdeskData){
                    if(err)
                    return res.send({status : 0, msg :err})
                    else
                    return res.send({status :1 , msg :"Help desk message sent."})
                })
            }
        })
    }
}

exports.get_message = function(req , res)
{
    if(req.body.type ==3)//Admin Explorar message
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>
        {
            if(err)
            return res.status(401).send({status : 0 , msg:err})
            else
            {
                let data = req.body
                let user_id = data.user_id
                let subject_type = data.subject_type

                Helpdesk.find({user_id :ObjectId(user_id) , subject_type : subject_type},function(err,helpdeskData){
                    if(err)
                    return res.send({status : 0 , msg : err})
                    else
                    return res.send({status : 1 , msg :"Data set done" , data : helpdeskData})
                }).sort({cdate : -1})
            }
        })
    }
    else
    if(req.body.type == 2)// Advertiser user message
    {
        CommonFile.check_authWithData(req.headers.token , (err , valueData)=>
        {
            if(err)
            return res.status(401).send({status : 0 , msg:err})
            else
            {
                let subject_type = req.body.subject_type
                Helpdesk.find({user_id :valueData._id , subject_type : subject_type},function(err,helpdeskData){
                    if(err)
                    return res.send({status : 0 , msg : err})
                    else
                    return res.send({status : 1 , msg :"Data set done" , data : helpdeskData})
                }).sort({cdate : -1})
            }
        })
    }
    else
    {
        NCommonFile.nuser_check_authWithData(req.headers.token , (err , valueData)=>
        {
            if(err)
            return res.status(401).send({status : 0 , msg:err})
            else
            {
               
                let subject_type = req.body.subject_type
                Helpdesk.find({user_id :valueData._id , subject_type : subject_type},function(err,helpdeskData){
                    if(err)
                    return res.send({status : 0 , msg : err})
                    else
                    return res.send({status : 1 , msg :"Data set done" , data : helpdeskData})
                }).sort({cdate : -1})
            }
        })
    }
}

exports.admin_getList_messageUsers = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value )=>{
        if(err)
        {
            return res.status(401).send({status : 0 , msg : err})
        }
        else
        {
            if(req.body.type == 2)// for advertiser
            {
                Helpdesk.aggregate([
                    { 
                        "$match" : {
                            "from" : 1.0, 
                            "user_type" : 2, 
                            "subject_type" : req.body.subject_type
                        }
                    }, 
                    { 
                        "$sort" : {
                            "cdate" : -1.0
                        }
                    }, 
                    { 
                        "$group" : {
                            "_id" : "$user_id", 
                            "is_read" : {
                                "$first" : "$is_read"
                            }
                        }
                    }, 
                    { 
                        "$lookup" : {
                            "from" : "ausers", 
                            "localField" : "_id", 
                            "foreignField" : "_id", 
                            "as" : "users"
                        }
                    }, 
                    { 
                        "$unwind" : {
                            "path" : "$users"
                        }
                    }, 
                    { 
                        "$project" : {
                            "_id" : 1.0, 
                            "is_read" : 1.0, 
                            "users.first_name" : 1.0, 
                            "users.last_name" : 1.0, 
                            "users.mobile_number" : 1.0
                        }
                    }
                ],function(err , result)
                {
                    if(err)
                    {
                        return res.send({status : 0 , msg : err})
                    }
                    else
                    {
                        return res.send({status : 1 , msg  : "" , data : result})
                    }
                })
            }
            else
            {
                Helpdesk.aggregate([
                    { 
                        "$match" : {
                            "from" : 1.0, 
                            "user_type" : 1.0, 
                            "subject_type" : req.body.subject_type
                        }
                    }, 
                    { 
                        "$sort" : {
                            "cdate" : -1.0
                        }
                    }, 
                    { 
                        "$group" : {
                            "_id" : "$user_id", 
                            "is_read" : {
                                "$first" : "$is_read"
                            }
                        }
                    }, 
                    { 
                        "$lookup" : {
                            "from" : "nusers", 
                            "localField" : "_id", 
                            "foreignField" : "_id", 
                            "as" : "users"
                        }
                    }, 
                    { 
                        "$unwind" : {
                            "path" : "$users"
                        }
                    }, 
                    { 
                        "$project" : {
                            "_id" : 1.0, 
                            "is_read" : 1.0, 
                            "users.first_name" : 1.0, 
                            "users.last_name" : 1.0, 
                            "users.mobile_number" : 1.0
                        }
                    }
                ],function(err , result)
                {
                    if(err)
                    {
                        return res.send({status : 0 , msg : err})
                    }
                    else
                    {
                        return res.send({status : 1 , msg  : "" , data : result})
                    }
                })
            }
        }
    })
   
}

exports.read_help_desk = function(req , res)
{
    if(req.body.type == 3)
    {
        CommonFile.admin_auth(req.headers.token,(err , value)=>{

            if(err)
            {
                return res.status(401).send({status : 0 , msg : err})
            }
            else
            {
                Helpdesk.updateMany({user_id : req.body.user_id , subject_type : req.body.subject_type , from : 1 , is_read : false},{$set :{is_read : true}}, function(err , DDDta){
                    res.send({status : 1 , msg : "record updated."})
                })
            }
        })
    }
    else
    if(req.body.type == 2)
    {
        CommonFile.check_authWithData(req.headers.token,(err , valueData)=>{

            if(err)
            {
                return res.status(401).send({status : 0 , msg : err})
            }
            else
            {
                Helpdesk.updateMany({user_id : valueData._id , subject_type : req.body.subject_type , from : 2 , is_read : false},{$set :{is_read : true}}, function(err , DDDta){
                    res.send({status : 1 , msg : "record updated."})
                })
            }
        })
    }
    else
    if(req.body.type == 1)
    {
        NCommonFile.nuser_check_authWithData(req.headers.token,(err , valueData)=>{

            if(err)
            {
                return res.status(401).send({status : 0 , msg : err})
            }
            else
            {
                Helpdesk.updateMany({user_id : valueData._id , subject_type : req.body.subject_type , from : 2 , is_read : false},{$set :{is_read : true}}, function(err , DDDta){
                    res.send({status : 1 , msg : "record updated."})
                })
            }
        })
    }
    else
    {
        res.send({status : 0 , msg : "perametes are missing."})
    }
}

exports.get_dashboard_unread_noti_helpdesk = function(req , res)
{
    if(req.body.type == 3)
    {
        CommonFile.admin_auth(req.headers.token , (err , value)=>{
            if(err)
            return res.status(401).send({status : 0 , msg : err})
            else
            {
                Helpdesk.count({is_read : false , from : 1} , function(err , p_count){
                    if(err)
                    return res.send({status : 0 , msg : "notification count error"})
                    else{
                        return res.send({status : 1 , msg :"notification count get.",total_count : p_count})
                    }
                })
            }
        })
    }
    else
    if(req.body.type == 2)//advertiser user 
    {
        CommonFile.check_authWithData(req.headers.token , (err , vauleData)=>{
            if(err)
            {
                return res.status(401).send({status : 0 , msg : err})
            }
            else
            {
                let total_c = 0
                let help_c = 0 
                let noti_c = 0 
                Helpdesk.count({is_read : false , from : 2 , user_type : 2 , user_id : vauleData._id} , function(err , p_count){
                    help_c = p_count
                    Notification.count({is_read : false , user_id : vauleData._id} , function(err  , p_count1){
                        noti_c = p_count1
                        res.send({status : 1 , msg : "notification count get.",data :{total_count  : help_c + noti_c  , help_count : help_c , noti_count : noti_c}})
                    })
                })
            }
        })
    }
    else
    {
        NCommonFile.nuser_check_authWithData(req.headers.token , (err , vauleData1)=>{
            if(err)
            {
                return res.status(401).send({status : 0 , msg : err})
            }
            else
            {
                let total_c = 0
                let help_c = 0 
                let noti_c = 0 
                Helpdesk.count({is_read : false , from : 2 , user_type : 1 , user_id : vauleData1._id} , function(err , p_count){
                    help_c = p_count
                    Notification.count({is_read : false , user_id : vauleData1._id} , function(err  , p_count1){
                        noti_c = p_count1
                        res.send({status : 1 , msg : "notification count get.",data :{total_count  : help_c + noti_c  , help_count : help_c , noti_count : noti_c}})
                    })
                })
            }
        })
    }
}