ObjectId = require('mongodb').ObjectID;
const adDetail = require('../models/adDetail.model');
const adMaster = require('../models/adMaster.model');
//const User = require('../models/user.model');
const Filter = require('../models/filter.model');
const CTemplate = require('../models/ctemplate.model');
const CommonFile = require('../constant.js');
//const Public_Questions = require('../models/public_questions.model')

//exports.advertise_create = function
exports.advertise_create = function (req, res)
 {
    // let ex_temp = req.body.template;
/*
     if(req.body.template != "")
        ex_temp = req.body.template*/

        let hold_days = 0;
        if(req.body.ad_type == 6 || req.body.ad_type == 7)
        {
            hold_days = req.body.calculations.second_final;
        }
        else
            hold_days = undefined

            console.log(req.body)
    let addetails = new adDetail(
        {
            adName: req.body.name,
            type: req.body.type == "individual"? 1 : 2 ,
            yourName:req.body.yourName,
            appName:req.body.appName,
            template:req.body.template,// template:JSON.parse(JSON.stringify(ex_temp)),// json
            questions : req.body.questions_ar,
            bannerLink:req.body.bannerLink,
            fullbanner_link:req.body.full_banner,
            comments:req.body.comments,
            hold_days : hold_days,
            hold_comment : req.body.hold_comment,
            review_days : req.body.review_days,
            review_comment : req.body.review_comment,
            review_templates : req.body.review_templates,

            short_desc : req.body.short_desc,
            desc : req.body.desc,
            pkg_name : req.body.pkg_name,

            filters:req.body.filters,/// json
            users:req.body.users,
            calculations:req.body.calculations// json
        }
    );

    var currentDate = new Date();
    CommonFile.check_authWithData_tax(req.headers.token , (error, user_data) =>
    {
        //console.log(user_data);
        if (error) 
        {
            //console.log(error);
            return res.status(401).send(JSON.stringify({ status : 0 , msg : error}));
        }
        else
        {
            let tax_rate = user_data.tax_rate;
            let tax_arr_data = user_data.tax_arr_data;

            let ad_type = parseInt(req.body.adtype_id);
            let ad_base_price = 0;
            let ad_filter_price = 0;
            let ad_tax_price = 0;
            let total_amount = 0;
            let total_user = parseInt(req.body.users)
            let m_amount = 0; // base amount
            let t_price = 0; // service req price 
            let min_second = 0;
            //let on_hold = 0;
            let sec_req = 0;

            let static_fil_ar = [1,2,3,6,7,8];

            let paid_filter_ar = req.body.calculations.paid_filter;
            
           //let d = req.query.search;
           CommonFile.calculate_applied_filter(paid_filter_ar ,req.body.filters,(error, filter_price) =>{
                if(error) {console.log(error);res.send(JSON.stringify({ status : 0 , msg : error}));}
                else
                {
                    ad_filter_price = filter_price;
                    CommonFile.get_adPrice_tier(ad_type,(error, adprice_tier) =>{
                        if(error)
                        {
                            console.log(error);
                           return res.send(JSON.stringify({ status : 0 , msg : error}));
                        }
                        else
                        { 

                            console.log(adprice_tier);
                            // type 1 , 2, 3 , 6 ,7 ,8
                            if(static_fil_ar.includes(ad_type))
                            {
                                sec_req = req.body.calculations.second_final;
                                ad_base_price = adprice_tier.min_amt;
                               if(ad_type == 6 || ad_type == 7)
                                {
                                    let review_amt = 0
                                    let hold_amt = 0;
                                   // let hold_amt_final = 0;
                                   let ext_amt =  min_second = adprice_tier.min_second;
                                    let extra_second = sec_req - min_second ;

                                    console.log(extra_second)
                                    if(req.body.is_review == true)
                                    {
                                        review_amt = adprice_tier.review_amt 
                                        console.log('------------review_amt----------------')
                                        console.log(review_amt)
                                        console.log('--------------------------------------')
                                    }

                                    if(req.body.is_hold == true)
                                    {
                                        console.log( adprice_tier.ext_amt * extra_second)
                                        hold_amt =   extra_second * adprice_tier.ext_amt
                                        console.log('-------------hold_amt--------------')
                                        console.log(hold_amt)
                                        console.log('--------------------------------------')
                                    }
                                    
                                    ad_base_price = ad_base_price + review_amt + hold_amt
                                    console.log(ad_base_price)
                                        console.log('--------------------------------------')
                                }
                                else
                                {
                                    
                                }

                                m_amount = (ad_base_price + ad_filter_price) * (total_user)
                                
                            }
                            else
                            {//type 4 , 5, 9 ,  , count extra second
                                sec_req = req.body.calculations.second_final // 15
                                min_second = adprice_tier.min_second; // 10
                                ad_base_price = adprice_tier.min_amt; // 0.4
                                //console.log(parseInt(sec_req) - min_second)
                                let extra_second = parseInt(sec_req) - min_second // 2 - 3 // 5
                                //console.log(sec_req)
                                //console.log(min_second)

                                if(extra_second == 0)
                                {

                                }
                                else
                                {
                                    if(ad_type == 5)
                                    {
                                        if(extra_second < 0)
                                            extra_second = 0
                                            console.log(JSON.stringify(req.body.questions_ar))
                                        let questions_ar = req.body.questions_ar
                                        console.log(Object.keys(questions_ar).length)
                                        if(Object.keys(questions_ar).length != sec_req)
                                        {
                                            extra_second = 500 ;// this is for testing 
                                        }
                                        
                                        ad_base_price = ad_base_price + (extra_second * adprice_tier.ext_amt);
                                        min_second = sec_req;
                                        console.log(questions_ar)
                                        console.log(questions_ar[0])
                                        
                                    }
                                    else
                                    {

                                   //console.log(extra_second)
                                    ad_base_price = ad_base_price + (extra_second * adprice_tier.ext_amt);// 0.4 + (5 * 0.02)
                                   // console.log(extra_second)
                                    min_second = sec_req;
                                    }
                                }
                                m_amount = (ad_base_price + ad_filter_price) * (total_user)
                            }
                            
                            console.log(m_amount);
                            
                            ad_tax_price = (m_amount) * (tax_rate/100);
                            total_amount = m_amount + ad_tax_price;
                            total_amount= roundToTwo(total_amount)

                            t_price = req.body.calculations.total;

                            console.log(ad_base_price);
                            console.log(ad_filter_price);
                            console.log(parseInt(total_user));
                            console.log(total_amount);
                            console.log(t_price);


                           // return res.status(200).send(JSON.stringify({ status : 0 , msg : "something gone wrong." }))

                            if(total_amount == t_price)
                            {
                                addetails.save(function(err)
                                {
                                    if(err)
                                    res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                                    else
                                    {
                                        let admaster = new adMaster(
                                            {
                                                advertiser_id :user_data.user_id,
                                                show_id : "AD-"+Math.floor(100000000 + Math.random() * 900000000),
                                                adName : req.body.name,
                                                adtype_id: req.body.adtype_id,
                                                details_id: addetails._id,
                                                is_active: true,
                                                is_approve: false,
                                                is_status : 0,
                                                pay_status : 0,// 0 for not paid , 1 for paid , 2 for refund
                                                totaluser_for_ads: total_user,
                                                totaluser_visitor : 0,
                                                final_amount : total_amount,
                                                final_tax_amount : ad_tax_price,
                                                final_filter_amount: ad_filter_price,
                                                final_sec : sec_req ,
                                                is_coupon : false ,
                                                mobile_number : req.body.mobile_number,
                                                wmobile_number : req.body.wmobile_number,
                                                location_link : req.body.location_link,
                                                tax_rate : JSON.parse(JSON.stringify(tax_arr_data)),
                                                cdate: currentDate,
                                                udate: currentDate
                                        }
                                        );
                    
                                        let filter_ = new Filter(
                                            {
                                                details_ad_id:addetails._id,
                                                gender:req.body.filters.gender,
                                                interest_ids:req.body.filters.interest,
                                                relation_ids:req.body.filters.relation,
                                                familym_ids:req.body.filters.familyMember,
                                                occupation_ids:req.body.filters.occupation,
                                                income_ids:req.body.filters.income,
                                                education_ids:req.body.filters.education,
                                                religion_ids:req.body.filters.religion,
                                                state_ids:req.body.filters.state,
                                                country_ids:req.body.filters.country,
                                                city_ids:req.body.filters.city,
                                                pincode_ids:req.body.filters.pincode,
                                                cdate:currentDate,
                                                udate:currentDate
                                            }
                                        );
                    
                                       // let ctemplate = new CTemplate({});
                                       /* if(req.body.fullbanner_link == "" || req.body.fullbanner_link == undefined)
                                        {
                                            ctemplate = new CTemplate(
                                                {
                                                    details_ad_id:addetails._id,
                                                    template_id :req.body.template.id,
                                                    //name: {type: String, required: true},
                                                    tmp_icon:req.body.template.logo,
                                                    tmp_image:req.body.template.image,
                                                    title:req.body.template.title,
                                                    btntitle: req.body.template.btnTxt,
                                                    desc:req.body.template.desc,
                                                    cdate:currentDate,
                                                    udate:currentDate
                                                }
                                            );
                                        }
                                        */
                                        admaster.save(function(err)
                                        {
                                            if(err)
                                            res.send(JSON.stringify({ status : 0 , msg : "something gone wrong." , err : err})); 
                                            else
                                            {
                                                filter_.save(function(err)
                                                {
                                                    if(err){ 
                                                        console.log(err)
                                                        res.send(JSON.stringify({ status : 0 , msg : err}));
                                                    }
                                                    else
                                                    console.log(filter_);
                                                })
                                                if(req.body.full_banner == "" || req.body.full_banner == undefined)
                                                {
                                                    if(ad_type == 5) // for public servay 
                                                    {
                                                        /*let public_questions = new Public_Questions({
                                                            details_ad_id:addetails._id,
                                                            questions_ar :req.body.questions_ar,
                                                            cdate:currentDate
                                                        })

                                                        public_questions.save(function(err){
                                                            if(err){ res.send(JSON.stringify({ status : 0 , msg : err}));}
                                                            else
                                                            console.log(public_questions);
                                                        })*/
                                                        
                                                    }
                                                    else
                                                    {
                                                      let  ctemplate = new CTemplate(
                                                            {
                                                                details_ad_id:addetails._id,
                                                                template_id :req.body.template.id,
                                                                //name: {type: String, required: true},
                                                                tmp_icon:req.body.template.logo,
                                                                tmp_image:req.body.template.image,
                                                                title:req.body.template.title,
                                                                btntitle: req.body.template.btnTxt,
                                                                desc:req.body.template.desc,
                                                                cdate:currentDate,
                                                                udate:currentDate
                                                            }
                                                        );
                                                        ctemplate.save(function(err)
                                                        {
                                                            if(err){console.log(err);
                                                                res.send(JSON.stringify({ status : 0 , msg : err}));
                                                            }
                                                            else
                                                            {console.log(ctemplate);
                                                            }
                                                        })
                                                    }
                                                }
                                                res.send(JSON.stringify({ status : 1 , msg : "advertise insert successfully.", data :admaster , wallet_balance : user_data.wallet_balance}));
                                            }
                                        })
                                    }
                                })
                             }
                              else
                                {
                                                    //price not match
                                    res.send(JSON.stringify({ status : 0 , msg : "Calculation not matched." })); 
                                }
                                        }
                                    })
                                }
                })
           
        }
    }
    )}
exports.ads_details_getbyId = function(req , res)
{
    let s_id = new ObjectId(req.body.advertise_id);
   // let is_admin = req.body.type
    //console.log(s_id);
    
    if(req.body.type == 2)// for admin
    {
        CommonFile.admin_auth(req.headers.token , (error, value) =>
        {
            if (error) 
            {
                return res.status(401).send(JSON.stringify({ status : 0 , msg : error}));
            }
            else
            {
              adMaster.aggregate([{
                    $lookup:{from:"addetails",localField:"details_id",foreignField:"_id", as : "details_data"}},
                    {$match : { _id : s_id}},
                    { 
                        $replaceRoot : {
                            "newRoot" : {
                                "$mergeObjects" : [
                                    {
                                        "$arrayElemAt" : [
                                            "$details_data", 
                                            0
                                        ]
                                    }, 
                                    "$$ROOT"
                                ]
                            }
                        }
                    }, 
                    { 
                        $project : {
                            "details_data" : 0
                            
                        }
                    }

                    ]).then(function(result,err)
                    {
                        if(err)
                           return res.send({status:0 , msg:"something gone wrong",err : err});
                        else
                        {
                            //var result = JSON.parse(result1)
                            let element = result[0] 

                            element["name"] = result[0].adName
                            delete element.type
                            delete element.adName
                            element["type"] = result[0].type == 1 ? "individual" : "company"
                            element["questions_ar"] = result[0].questions
                            delete element.questions
                            element["full_banner"] = result[0].fullbanner_link
                            delete element.fullbanner_link

                            let re_d = []
                            re_d.push(element)

                           return res.send({ status : 1 , msg : "advertise details get." , data :re_d});
                        }
                            
                    });
            }
        });
    }
    else// for normal user
    {
        CommonFile.check_authWithId(req.headers.token , (error, value) =>
        {
            if (error) 
            {
                return res.send(JSON.stringify({ status : 0 , msg : error}));
            }
            else
            {
              adMaster.aggregate([{
                    $lookup:{from:"addetails",localField:"details_id",foreignField:"_id", as : "details_data"}},
                    {$match : { _id : s_id , advertiser_id : value}},
                    { 
                        $replaceRoot : {
                            "newRoot" : {
                                "$mergeObjects" : [
                                    {
                                        "$arrayElemAt" : [
                                            "$details_data", 
                                            0
                                        ]
                                    }, 
                                    "$$ROOT"
                                ]
                            }
                        }
                    }, 
                    { 
                        $project : {
                            "details_data" : 0
                            
                        }
                    }

                    ]).then(function(result,err)
                    {
                        if(err)
                            res.send({status:0 , msg:"something gone wrong",err : err});
                        else
                            res.send(JSON.stringify({ status : 1 , msg : "advertise details get." , data :result}));
                    });
            }
        });
    }
    
}
exports.advertise_getMy = function(req , res)
{
    //let s_id = new ObjectId(req.params.id);
    CommonFile.check_authWithId(req.headers.token , (error, value) =>
        {
            if (error)
            {
                return res.send(JSON.stringify({ status : 0 , msg : error}));
            }
            else
            {//.skip(1).limit(2).pretty()
                /*
                adMaster.aggregate([{
                        $lookup:{from:"addetails",localField:"details_id",foreignField:"_id", as : "details_data"}},
                        {$match : { advertiser_id : value}}
                        ]).then(function(result,err)
                        {
                        //console.log(result);
                            if(err)
                                res.send({status:0 , msg:"something gone wrong",err : err});
                            else
                                res.send(JSON.stringify({ status : 1 , msg : "advertise details get." , data :result}));
                        });
                    */
            }
        });
}
exports.advertise_edit = function(req , res)
{
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        return res.status(401).send({status : 0 , msg : err})

        //let element = {}
        
        adMaster.findOneAndUpdate( {_id : req.body.advertise_id}, {$set : {adName : req.body.name}},function(err , admasterdata)
        {
            if(err)
            {
                return res.send({status : 0 , msg : err})
            }
            else
            {
                if(admasterdata)
                {
                    let element = {}
                    element["questions"] = req.body.questions_ar
                    element["type"] = req.body.type == "individual"? 1 : 2 
                    
                    element["adName"] = req.body.name
                    element["yourName"] = req.body.yourName

                    if(req.body.full_banner == "" || req.body.full_banner == undefined)
                    {
                        element["template"] = req.body.template
                        element["fullbanner_link"] = ""
                    }
                    else
                    {
                        element["template"] = ""
                        element["fullbanner_link"] = req.body.full_banner
                    }


                    //if(req.body.full_banner == "" || req.body.full_banner == undefined)
                    
                    adDetail.findOneAndUpdate({_id : admasterdata.details_id},{$set : element},function(err , updated)
                    {
                        if(err)
                        {
                            return res.send({status : 0 , msg : err})
                        }
                        else
                        {
                            return res.send({status : 1 , msg : "Advertise Details updated successfully"})
                        }
                    })
                }
                else
                {
                    return res.send({status : 0 , msg : "advertise not found."})
                }
            }
        })
    })
    //let s_id = new ObjectId(req.params.id);
   /* CommonFile.check_authWithId(req.headers.token , (error, value) =>
        {
            if (error)
            {
                return res.send(JSON.stringify({ status : 0 , msg : error}));
            }
            else
            {
              adMaster.aggregate([{
                    $lookup:{from:"addetails",localField:"details_id",foreignField:"_id", as : "details_data"}},
                    {$match : { advertiser_id : value}}
                    ]).then(function(result,err)
                    {
                    //console.log(result);
                        if(err)
                            res.send({status:0 , msg:"something gone wrong",err : err});
                        else
                            res.send(JSON.stringify({ status : 1 , msg : "advertise details get." , data :result}));
                    });
            }
        });*/
}
/*
exports.get_advertise_details = function(req , res)
{
    let is_admin = req.type 
    if(is_admin == 1)// admin
    {
        CommonFile.admin_auth(req.headers.token ,(err , is_allow)=>
        {
            if(err)
            {
                res.send({status : 0 ,msg : err})
            }
            else
            {
                adDetail.findOne({_id : details_id},function(err , addetailsData)
                {
                    if(addetailsData)
                    {
                        res.send({status : 1 , msg : "details listed.", data : addetailsData})
                    }
                    else
                    {
                        res.send({status : 0 ,msg : "no ads details found.",data : err})
                    }
                })
            }
        })
    }
    else
    if(is_admin == 2)// for advertiser user
    {
        CommonFile.check_auth(req.headers.token , (err , is_allow)=>
        {
            if(err)
            {
                res.send({status : 0 ,msg : err})
            }
            else
            {
                adDetail.findOne({_id : details_id},function(err , addetailsData)
                {
                    if(addetailsData)
                    {
                        res.send({status : 1 , msg : "details listed.", data : addetailsData})
                    }
                    else
                    {
                        res.send({status : 0 ,msg : "no ads details found.",data : err})
                    }
                })
            }
        })
    }
}
*/
/*
function roundUp(num, precision) {
    precision = Math.pow(100, precision)
    return Math.ceil(num * precision) / precision
  }
*/
function roundToTwo(num) {    
    return +(Math.round(num + "e+3")  + "e-3");
}