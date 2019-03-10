const Commonfile = require('../../constant')
const NCommonfile = require('../../nconstant')
const NUsers = require('../../models/nuser_model/nuser.model')
const Ausers = require('../../models/user.model')
const Notification = require('../../models/notification_model/notification.model')
ObjectId = require('mongodb').ObjectID;

exports.addBroadcast = function(req , res)
{
    Commonfile.admin_auth(req.headers.token , (err , value)=>{
        if(err)
        {
            res.status(401).send({status :0  , msg :err})
        }
        else
        {
            let ddata = req.body
            let d_now = new Date()

            if(ddata.to_type == 1 || ddata.to_type == 3)//for Advertiser
            {
                Ausers.find({is_verify : true ,is_active : true},function(err , auserData)
                {
                    let data = []
                    auserData.forEach(element =>
                        {
                            let ar = {user_id : ObjectId(element._id),user_type : 1 , noti_type :1,noti_title:ddata.noti_title , noti_desc : ddata.noti_desc , is_read : false , cdate : d_now}
                            data.push(ar)
                        })

                        Notification.insertMany(data ,function(err , val){
                            if(err)
                            {
                                //console.log("error to insert multiple -- "+err)
                                res.send({status : 0 , msg :"error "+err})
                            }
                            else
                                res.send({status : 1 , msg :"Notification sent successfully."})
                            //console.log(val.insertedCount+" documents inserted --"+data.length);
                        })

                })
            } 
            if(ddata.to_type == 2 || ddata.to_type == 3)//for End user
            {
                NUsers.find({is_verify : true ,is_active : true ,is_approve : 1},function(err , nuserData)
                {
                    let data = []

                    nuserData.forEach(element =>
                        {
                            let ar = {user_id : ObjectId(element._id),user_type : 2 , noti_type :1,noti_title:ddata.noti_title , noti_desc : ddata.noti_desc , is_read : false , cdate : d_now}
                            data.push(ar)
                        })

                        if(data.length > 0)
                        NCommonfile.send_notification(nuserData ,ddata.noti_title ,ddata.noti_desc)
                        Notification.insertMany(data ,function(err , val)
                        {
                            if(err)
                            {
                                res.send({status : 0 , msg :"error "+err})
                            }
                            else
                                res.send({status : 1 , msg :"Notification sent successfully."})
                        })

                })
            }
        }
    })
}

exports.send_notification_single_user = function(req , res)
{
    Commonfile.admin_auth(req.headers.token , (err , value)=>{
        if(err)
        {
            res.status(401).send({status :0  , msg :err})
        }
        else
        {
            let ddata = req.body
            let d_now = new Date()

            if(ddata.to_type == 1 )//for Advertiser
            {
                //Ausers.find({is_verify : true ,is_active : true},function(err , auserData)
                //{
                    let data = []
                   // auserData.forEach(element =>
                    //    {
                            let ar = {user_id : ObjectId(ddata.user_id),user_type : 1 , noti_type :1,noti_title:ddata.noti_title , noti_desc : ddata.noti_desc , is_read : false , cdate : d_now}
                            data.push(ar)
                     //   })

                        Notification.insertMany(data ,function(err , val){
                            if(err)
                            {
                                //console.log("error to insert multiple -- "+err)
                                res.send({status : 0 , msg :"error "+err})
                            }
                            else
                                res.send({status : 1 , msg :"Notification sent successfully."})
                            //console.log(val.insertedCount+" documents inserted --"+data.length);
                        })

              //  })
            } 
            if(ddata.to_type == 2 )//for End user
            {
                NUsers.find({_id : ObjectId(ddata.user_id) , is_verify : true ,is_active : true ,is_approve : 1},function(err , nuserData)
                {
                    let data = []

                    nuserData.forEach(element =>
                        {
                            let ar = {user_id : ObjectId(ddata.user_id),user_type : 2 , noti_type :1,noti_title:ddata.noti_title , noti_desc : ddata.noti_desc , is_read : false , cdate : d_now}
                            data.push(ar)
                        })

                        if(data.length > 0)
                        NCommonfile.send_notification(nuserData ,ddata.noti_title ,ddata.noti_desc)
                        Notification.insertMany(data ,function(err , val)
                        {
                            if(err)
                            {
                                res.send({status : 0 , msg :"error "+err})
                            }
                            else
                                res.send({status : 1 , msg :"Notification sent successfully."})
                        })

                })
            }
        }
    })
}

exports.getNotification = function(req , res)
{
    NCommonfile.nuser_check_auth(req.headers.token , (err , nuseData)=>
    {
        if(err)
        {
            Commonfile.check_authWithData(req.headers.token , (err1 , userData)=>{
                if(err1)
                {
                    return res.status(401).send({status : 0 , msg : err1})
                }
                else
                {
                    Notification.find({user_id : userData._id , user_type : 1} , function(err2 , notificationData){
                        if(notificationData)
                        return res.send({status : 1 , msg :"notification listed" , data : notificationData})
                        else
                        return res.send({status : 0 , msg : " no notification found." , data :[]})  
                    })
                }
            })
        }
        else
        {
            Notification.find({user_id : userData._id , user_type : 2} , function(err2 , notificationData){
                if(notificationData)
                return res.send({status : 1 , msg :"notification listed" , data : notificationData})
                else
                return res.send({status : 0 , msg : " no notification found." , data :[]})  
            })
        }
    })
    /*
    if(req.body.type == 2)
    {
        Commonfile.admin_auth(req.headers.token , (err , value)=>
        {
            let data = req.body
            if(data.noti_type == 1)//advertiser
            {

            }
            else
            {

            }
        })
    }
    else
    {

    }
    */
}

exports.readnotification = function (req , res)
{
    NCommonfile.nuser_check_auth(req.headers.token , (err , nuseData)=>
    {
        if(err)
        {
            Commonfile.check_authWithData(req.headers.token , (err1 , userData)=>{
                if(err1)
                {
                    return res.status(401).send({status : 0 , msg : err1})
                }
                else
                {
                    Notification.findOneAndUpdate({user_id : userData._id , user_type : 1 , is_read : false , _id : req.body.noti_id} , {$set :{is_read : true}} , function(err2 , notificationData){
                        if(notificationData)
                        return res.send({status : 1 , msg :"notification read" , data : notificationData})
                        else
                        return res.send({status : 0 , msg : " no notification found." , data :[]})  
                    })
                }
            })
        }
        else
        {
            Notification.findOneAndUpdate({user_id : userData._id , user_type : 2 , is_read : false , _id : req.body.noti_id} , {$set :{is_read : true}} , function(err2 , notificationData){
                if(notificationData)
                return res.send({status : 1 , msg :"notification read." , data : notificationData})
                else
                return res.send({status : 0 , msg : " no notification found." , data :[]})  
            })
        }
    })
}