const Commonfile = require('../../constant')
const NCommonfile = require('../../nconstant')
const NUsers = require('../../models/nuser_model/nuser.model')
const Ausers = require('../../models/user.model')
const Notification = require('../../models/notification_model/notification.model')
const Notification_master = require('../../models/notification_model/notification_master.model')
ObjectId = require('mongodb').ObjectID;

exports.addBroadcast = function(req , res)
{
    Commonfile.admin_auth_withData(req.headers.token , (err , value)=>{
        if(err)
        {
            res.status(401).send({status :0  , msg :err})
        }
        else
        {
            let ddata = req.body
            let d_now = new Date()

            let user_type = 3
            if(ddata.to_type == 1)
                user_type = 1
            else if(ddata.to_type == 2)
                user_type = 2

            let notification_master = new Notification_master({
                admin_id:value._id,
                user_type :user_type,// 1 for advertiser , 2 for end user // 3 for all and multiple
                noti_type: 1,// 1 for broadcast // 2 for transaction
                msg_type : ddata.msg_type, // 1 for text // 2 for Image
                noti_title: ddata.noti_title,
                noti_desc: ddata.noti_desc ,
                cdate:d_now
            })
            notification_master.save(function(err , notificationData){
                if(err)
                {
                   return res.send({status : 0 , msg :err})
                }
                else{

                
                    if(ddata.to_type == 1 || ddata.to_type == 3)//for Advertiser
                    {
                        Ausers.find({is_verify : true ,is_active : true},function(err , auserData)
                        {
                            let data = []
                            auserData.forEach(element =>
                                {
                                    let ar = {user_id : ObjectId(element._id) , detail_id : notificationData._id,user_type : 1 , noti_type :1 , msg_type :ddata.msg_type,noti_title:ddata.noti_title , noti_desc : ddata.noti_desc , is_read : false , cdate : d_now}
                                    data.push(ar)
                                })
        
                                Notification.insertMany(data ,function(err , val){
                                    if(err)
                                    {
                                        //console.log("error to insert multiple -- "+err)
                                       return res.send({status : 0 , msg :"error "+err})
                                    }
                                    else
                                        if(ddata.to_type == 1)
                                        return res.send({status : 1 , msg :"Notification sent successfully."})
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
                                    let ar = {user_id : ObjectId(element._id) , detail_id : notificationData._id ,user_type : 2 , noti_type :1, msg_type :ddata.msg_type,noti_title:ddata.noti_title , noti_desc : ddata.noti_desc , is_read : false , cdate : d_now}
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
    })
}
exports.send_notification_single_user = function(req , res)
{
    Commonfile.admin_auth_withData(req.headers.token , (err , value)=>{
        if(err)
        {
            res.status(401).send({status :0  , msg :err})
        }
        else
        {
            let ddata = req.body
            let d_now = new Date()
            let user_type = 6
            if(ddata.aduser_ids.length > 0 && ddata.enduser_ids.length > 0)
            {
                user_type = 6
            }
            else
            if(ddata.aduser_ids.length > 0)
            {
                user_type = 4
            }else
            if(ddata.enduser_ids.length > 0)
            {
                user_type = 5
            }
            else
            {
                return res.send({status : 0 , msg :"advertiser user or enduser "})
            }

            let notification_master = new Notification_master({
                admin_id:value._id,
                user_type :user_type,// 1 for advertiser , 2 for end user // 3 for all and multiple 4// some advertiser // 5 some end user // 6 multiple
                noti_type: 2,// 1 for broadcast // 2 for transaction
                msg_type : ddata.msg_type, // 1 for text // 2 for Image
                noti_title: ddata.noti_title,
                noti_ids : (ddata.aduser_ids).concat(ddata.enduser_ids),
                noti_desc: ddata.noti_desc ,
                cdate:d_now
            })
            notification_master.save(function(err , notificationData){
                if(err)
                {
                   return res.send({status : 0 , msg :err})
                }
                else{

                
                    if(ddata.aduser_ids.length > 0 )//for Advertiser
                    {
                        Ausers.find( { myCode :{$in : ddata.aduser_ids},is_verify : true ,is_active : true},function(err , auserData)
                        {
                            let data = []
                            auserData.forEach(element =>
                                {
                                    let ar = {user_id : ObjectId(element._id) , detail_id : notificationData._id,user_type : 1 , noti_type :2 , msg_type : ddata.msg_type,noti_title:ddata.noti_title , noti_desc : ddata.noti_desc , is_read : false , cdate : d_now}
                                    data.push(ar)
                                })
        
                                Notification.insertMany(data ,function(err , val){
                                    if(err)
                                    {
                                        //console.log("error to insert multiple -- "+err)
                                       return res.send({status : 0 , msg :"error "+err})
                                    }
                                    else
                                    {
                                        if(ddata.enduser_ids.length == 0)
                                        res.send({status : 1 , msg :"Notification sent successfully."})
                                    }
                                        
                                    //console.log(val.insertedCount+" documents inserted --"+data.length);
                                })
        
                        })
                    } 
                    if(ddata.enduser_ids.length > 0)//for End user
                    {
                        NUsers.find({myCode :{$in : ddata.enduser_ids},is_verify : true ,is_active : true ,is_approve : 1},function(err , nuserData)
                        {
                            let data = []
        
                            nuserData.forEach(element =>
                                {
                                    let ar = {user_id : ObjectId(element._id) , detail_id : notificationData._id ,user_type : 2 , noti_type :2, msg_type :ddata.msg_type,noti_title:ddata.noti_title , noti_desc : ddata.noti_desc , is_read : false , cdate : d_now}
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
            /*if(ddata.to_type == 1 )//for Advertiser
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
            }*/
        }
    })
}
exports.getNotification = function(req , res)
{
    NCommonfile.nuser_check_authWithData(req.headers.token , (err , nuseData)=>
    {
        //console.log(nuseData)
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
            Notification.find({user_id : nuseData._id , user_type : 2} , function(err2 , notificationData){
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
exports.admin_getNotification_List = function(req, res)
{// 0 for all() , 1 not approved , 2 for rejected by admin , 3 for approved & running  , 4 completed

    Commonfile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {//res.status(401).send({ status : 0 , msg :  err});
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
                let params = req.query;
                let limit = Number(params.maxRecords);
                let frm = Number(params.startFrom);
                //let type = Number(params.type);
                let search_data = ""//params.search_data
    
                let t_data = 0;

                Notification_master.count({},function(err,cou){if (err) {} else {t_data= cou;
                    Notification_master.find({},function(err,notificationData){
                        if (err)
                        res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                        else
                        {
                            res.send(JSON.stringify({ status : 1 , msg : "advertise listed successfully.","p_count": t_data, data :notificationData}));
                        }
                    }).count().sort( { cdate: -1 } ).skip(frm).limit(limit); }});

               
            }
        })
}
exports.readnotification = function (req , res)
{
    NCommonfile.nuser_check_authWithData(req.headers.token , (err , nuseData)=>
    {
        if(err)
        {
            Commonfile.check_authWithData(req.headers.token , (err1 , userData1)=>{
                if(err1)
                {
                    return res.status(401).send({status : 0 , msg : err1})
                }
                else
                {
                    //Notification.findOneAndUpdate({user_id : userData._id , user_type : 1 , is_read : false , _id : req.body.noti_id} , {$set :{is_read : true}} , function(err2 , notificationData){
                        Notification.updateMany({user_id : userData1._id , user_type : 1 , is_read : false } , {$set :{is_read : true}} , function(err2 , notificationData){
                        if(notificationData)
                            return res.send({status : 1 , msg :"notification read" })
                        else
                            return res.send({status : 0 , msg : " no notification found." })  
                    })
                }
            })
        }
        else
        {
           // Notification.findOneAndUpdate({user_id : userData._id , user_type : 2 , is_read : false , _id : req.body.noti_id} , {$set :{is_read : true}} , function(err2 , notificationData){
                Notification.updateMany({user_id : nuseData._id , user_type : 2 , is_read : false } , {$set :{is_read : true}} , function(err2 , notificationData){
                if(notificationData)
                return res.send({status : 1 , msg :"notification read." })
                else
                return res.send({status : 0 , msg : " no notification found." })  
            })
        }
    })
}
exports.admin_notification_data = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {//res.status(401).send({ status : 0 , msg :  err});
          return  res.status(401).send({status:0 , msg : err})
        }
        else
        {
            Notification.find({detail_id : ObjectId(req.body.detail_id)},function(err , notidata){
                if(err)
                res.send({status : 0 , msg :err})
                else
                res.send({status : 1 , data :notidata})
            })
        }
    })
}