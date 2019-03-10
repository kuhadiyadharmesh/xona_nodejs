const Coupon = require('../models/coupon.model');
const CommonFile = require('../constant.js')
const AdMaster = require('../models/adMaster.model');

exports.create_coupon = function(req ,res) 
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
            Coupon.findOne({coupon_code : req.body.coupon_code}, function(err , existcode)
            {
                if(existcode)
                {
                    return res.send({status : 0 , msg : "coupon code already existed."})
                }
                else
                {
                    let cdate = new Date();
                    let coupon = new Coupon(
                    {
                        ad_types : JSON.stringify(req.body.ad_types) ,
                        ad_amount : req.body.ad_amount ,
                        ad_amount_type : req.body.ad_amount_type ,// 1 or -1 (1 for max , -1 for min)
                        filter_amount: req.body.filter_amount,
                        filter_amount_type: req.body.filter_amount_type, // 1 or -1 (1 for max , -1 for min)
                        target_user:req.body.target_user,
                        target_user_type : req.body.target_user_type, // 1 or -1 (1 for max , -1 for min)
                        coupon_code:req.body.coupon_code,
                        per_user_limit : req.body.per_user_time,
                        max_use : req.body.max_use,
                        total_used: 0,
                        discount_value : req.body.discount_value,
                        discount_type : req.body.discount_type,// 1 for amount , 2 for %
                        is_active :true, // this for delete user
                        is_expire :false, // this for coupon validiti finish.
                        cdate:cdate,
                        udate:cdate
                    })
                    coupon.save(function(err)
                    {
                        if(err){
                          return  res.send(JSON.stringify({ status : 0 , msg : err}));
                        }
                        else {
                          return  res.send(JSON.stringify({ status : 1 , msg : "coupon insert successfully.", data :coupon}));
                        }
                    })
                }
            })
           
        }
    })
}
exports.get_coupon_list = function(req ,res)
{
    let params = req.query;
    let limit = Number(params.maxRecords);
    let frm = Number(params.startFrom);
    //let type = Number(params.type);
    //let enduser_id = params.enduser_id
    let search_data = params.search_data
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
            Coupon.count({$or : [{'coupon_code': new RegExp(search_data, 'i')}]},function(err,cou){if (err) {} else {t_data= cou;

            Coupon.find({$or : [{'coupon_code': new RegExp(search_data, 'i')}]},function(err , coupons){
                if(err){
                  return  res.send({ status : 0 , msg : err});
                }
                else {
                  return  res.send({ status : 1 , msg : "coupon insert successfully.", data :coupons ,"p_count":t_data});
                }
            }).count().sort( { cdate: -1 } ).skip(frm).limit(limit); }});
        }
        
    })
}
exports.checkValidation_coupon = function(req , res)
{
    let coupon = req.body.coupon_code;
    let advertise_id = req.body.ad_id

    CommonFile.check_authWithId(req.headers.token , (err , user_id)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 ,msg : err})
        }
        else
        {
            Coupon.find({coupon_code:coupon,is_active:true, is_expire:false},function(err , arr_couponData)
            {
                if(err)
                {
                   return res.send(JSON.stringify({status:0 ,msg : "Something gone wrong.", err : err}))
                }
                else
                {
                    if(arr_couponData.length == 0)
                    {
                       return res.send(JSON.stringify({status:0 ,msg : "coupon code not valid ."}))
                    }
                    else
                    {
                        let couponData = arr_couponData[0];
                        CommonFile.getAdMaster_allData(advertise_id , 0 , (err , adData)=>
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
                                    {console.log(14);
                                      return  res.send(JSON.stringify({status:0 ,msg : msg}))
                                    }
                                    else
                                    {console.log(15);
                                      return  res.send(JSON.stringify({status : 1 , msg : "list got ", data: {"coupon_id":couponData._id,"discount_value": couponData.discount_value, "discount_type":couponData.discount_type}}))
                                    }
                                })
                            }
                        })
                         
                    }
                }
            })
        }
       
    })
    
}
exports.generate_coupon = function(req,res)
{
    
}

exports.update_coupon = function(req , res)
{

}