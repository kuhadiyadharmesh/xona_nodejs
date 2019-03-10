const express = require('express');
const router = express.Router();
/*
const multer = require('multer');
var upload = multer({ storage: storage });
var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    }
});
*/
// extra NPM Install
// 1 - for uniqid - https://www.npmjs.com/package/uniqid
// NPM for request to other server
//https://www.thepolyglotdeveloper.com/2017/10/consume-remote-api-data-nodejs-application/
//const cron_point_paid_Controller = require('../controllers/Crons/team_bonus.controller')
// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require('../controllers/auser.controller');
const nuser_controller = require('../controllers/nuser_controllers/nuser.controller')
//common controller
const country_controller = require('../controllers/country.controller');
const city_controller = require('../controllers/city.controller');
const state_controller = require('../controllers/state.controller');
const pincode_controller = require('../controllers/pincode.controller');
const filter_controller = require('../controllers/filter_Data.controller');
const fileupload_controller = require('../controllers/fileupload.controller');
const userDocument_controller = require('../controllers/auser_Document.controller');

//const ctemplate_controller = require('../controllers/ctemplate.controller');
const template_controller = require('../controllers/template.controller');

const advertise_controller = require('../controllers/adDetail.controller');
const admaster_controller = require('../controllers/adMaster.controller');

const adPriceTier_controller = require('../controllers/adPriceTier.controller');
const adFilterPriceTier_controller = require('../controllers/adPriceTier_Filter.controller');

const aUserWallet = require('../controllers/auser_wallet.controller');
const payment_controller  = require('../controllers/payment.controller');

const coupon_controller = require('../controllers/coupon.controller');
const Transaction_Controller = require('../controllers/atransaction.controller')
const dashboard = require('../controllers/dashboard.controller')
const admin_user_controller = require('../controllers/admin_user.controller')
const point_system_controller = require('../controllers/pointsystem.controller')

const referral_system_controller = require('../controllers/referral_system.controller')
const referral_user_controller = require('../controllers/referral_users.controller')
const withdraw_controller = require('../controllers/withdraw_request.controller')

const nuser_bankDetails_controller = require('../controllers/nuser_controllers/nuser_bankdetails.controller')
//const Sticker_category_controller = require('../controllers/Strickers/category.controller')
const inquiry_controller = require('../controllers/public_controller/inquiry.controller')
const nUser_Wallet_controller = require('../controllers/nuser_wallet.controller')
const notification_controller = require('../controllers/Notification_Controller/notification.controller')

const help_desk_controller = require('../controllers/helpdesk_controller/helpdesk.controller')


//-----------------------------------
/*
const custome_cron_controller = require('../controllers/Crons/custom_cron.controller')
router.get('/cron_adlive',custome_cron_controller.live_ads)
router.post('/cron_c2',custome_cron_controller.update_downline_temp)
router.post('/cron_c3',custome_cron_controller.update_final_wallet)*/

// -------------------------------------------- Public API -------------------------------
router.post('/add_inquiry',inquiry_controller.save_inqury)
router.get('/get_inquiry_list',inquiry_controller.get_all_inqury)

//--------------------------------------------- Admin API --------------------------------------------------

//Admin login
router.post('/login',admin_user_controller.admin_login)
router.get('/admin_logout',admin_user_controller.logout)
router.post('/admin_advertiser_approve_reject', user_controller.admin_approve_profile)
router.post('/admin_start_pause_advertise',admaster_controller.admin_user_start_pause_advertise)

router.post('/add_template', template_controller.template_create);

router.get('/get_all_advertiser',user_controller.admin_getall_user);
router.get('/get_all_enduser',nuser_controller.admin_getall_users);
router.post('/admin_enduser_approve',nuser_controller.admin_user_approve);
router.post('/admin_enduser_get_profile', nuser_controller.getuser_profile);
router.post('/admin_enduser_update_profile',nuser_controller.user_update_profile)

router.post('/add_country', country_controller.country_create);
router.put('/:id/country_update', country_controller.country_update);
router.delete('/:id/country_delete', country_controller.country_delete);

router.post('/add_state', state_controller.state_create);
router.put('/:id/state_update', state_controller.state_update);
router.delete('/:id/state_delete', state_controller.state_delete);

router.put('/:id/city_update', city_controller.city_update);
router.delete('/:id/city_delete', city_controller.city_delete);

router.put('/:id/pincode_update', pincode_controller.pincode_update);
router.delete('/:id/pincode_delete', pincode_controller.pincode_delete);

router.put('/:id/template_delete', template_controller.template_delete);

router.get('/admin_get_adpricetire',adPriceTier_controller.getAllprice)
router.post('/admin_update_adpricetire',adPriceTier_controller.price_update)
router.get('/admin_get_taxprice',adPriceTier_controller.getTax_data)
router.post('/admin_update_taxprice',adPriceTier_controller.Tax_update)
router.get('/admin_get_pointtomoney',adPriceTier_controller.get_PointtoMoney)
router.post('/admin_update_pointtomoney',adPriceTier_controller.update_Pointtomoney)
router.get('/admin_get_withdraw_setting',adPriceTier_controller.get_witdrawal_setting)
router.post('/admin_update_withdraw_setting',adPriceTier_controller.update_witdrawal_setting)

router.post('/add_filterpricetier',adFilterPriceTier_controller.filterprice_create);//crate_filterprice
router.post('/admin_update_filterpricetier',adFilterPriceTier_controller.update_filterprice);//crate_filterprice
router.post('/admin_update_filter_freevalues',adFilterPriceTier_controller.update_filter_freevalues);//crate_filterprice

//Admin Advertise
router.get('/admin_getall_advertise',admaster_controller.advertise_admin_getAll);
router.post('/admin_update_advertise',admaster_controller.advertise_adminstatus_update);
router.post('/start_pause_advertise',admaster_controller.user_start_pause_advertise)
router.post('/update_advertise',advertise_controller.advertise_edit)
router.post('/admin_add_coupon',coupon_controller.create_coupon);
router.get('/admin_get_couponlist',coupon_controller.get_coupon_list)

router.get('/admin_getall_pointsystem',point_system_controller.getall_pointsystem)
router.post('/admin_update_pointsystem',point_system_controller.update_pointsystem)

router.get('/admin_getreferral_system' , referral_system_controller.getReferral_System)
router.post('/admin_update_referral_system',referral_system_controller.update_Referral_system)

router.get('/admin_get_withdraw_list',withdraw_controller.get_withdraw_list)
router.post('/admin_withdraw_approve_reject',withdraw_controller.withdraw_step_one)
router.post('/admin_withdraw_submeet_complete',withdraw_controller.withdraw_final_manual_step)
router.post('/admin_withdraw_reject',withdraw_controller.withdraw_final_manual_step_reject)

router.post('/get_myteam',referral_user_controller.get_my_referralusers)
router.post('/get_level_person',referral_user_controller.get_myteam_level_first_level)
router.post('/get_upperlevel_list',referral_user_controller.get_my_upperreferralusers)

router.get('/getall_dashboard_data',dashboard.admin_dashboard_data)

router.post('/getnuser_earninig',nUser_Wallet_controller.get_earninig)

//admin_user_start_pause_advertise
router.post('/upload_notification_img',fileupload_controller.notification_img)
router.post('/create_broadcast_notification',notification_controller.addBroadcast)
router.get('/admin_getNotification_List',notification_controller.admin_getNotification_List)
router.get('/get_notification',notification_controller.getNotification)//admin_getNotification_List
router.post('/read_notification',notification_controller.readnotification)
router.post('/notification_details',notification_controller.admin_notification_data)

router.post('/send_notification_single',notification_controller.send_notification_single_user)

router.post('/add_update_enduser_balance',nUser_Wallet_controller.admin_edit_balance)
// a simple test url to check that all of our files are communicating correctly.
//router.get('/test', product_controller.test);

router.post('/helpdesk_response',help_desk_controller.send_message)

router.post('/admin_helpdesk_getUser_List',help_desk_controller.admin_getList_messageUsers)
router.post('/read_help_desk',help_desk_controller.read_help_desk)

//---------------------------------------------- Common API ------------------------------------------------

router.post('/update_advertiser_profile', user_controller.user_update_profile);
router.post('/get_advertiser_profile', user_controller.getuser_profile);
router.post('/admin_get_enduser_bankdetails',nuser_bankDetails_controller.get_bankaccount)

router.post('/get_advertiser_view_details',admaster_controller.getAdvertiser_View_userlist)
router.post('/get_advertiselist_byuserid',admaster_controller.admin_getadvertise_byadvertiserID_list)
router.post('/admin_user_block_unblock',nuser_controller.admin_user_block_unblock)
router.post('/top_notification_badge',help_desk_controller.get_dashboard_unread_noti_helpdesk)

//---------------------------------------------  Advertiser api -------------------------------------------------
router.post('/register_user', user_controller.user_create);
router.post('/send_otp', user_controller.user_send_otp);
router.post('/verify_otp', user_controller.user_verify_otp);
router.get('/logout',user_controller.logout)
// Country Route
router.get('/getallcountry', country_controller.country_details);
// State Route
router.get('/getallstate', state_controller.Allstate_details);
router.post('/getstate_bycountry', state_controller.state_details_By_countryId);
router.post('/add_city', city_controller.city_create);
router.post('/getcity_bystate', city_controller.city_details_By_stateId);
router.post('/add_pincode', pincode_controller.pincode_create);
router.post('/getpincode_bycity', pincode_controller.pincode_details_By_cityId);

router.post('/gettemplates', template_controller.template_all);//template_delete

//testing
//router.post('/upload_document',user_controller.user_document);

//user_DocumentUpload
router.post('/add_document',userDocument_controller.document_create);

// for advertise type
router.post('/get_pricetier',adPriceTier_controller.getprice);


// for filter type

router.get('/get_filterpricetier',adFilterPriceTier_controller.get_filterprice);//crate_filterprice

// /update_filter_freevalues

router.post('/add_advertise',advertise_controller.advertise_create);
router.post('/get_ads_details',advertise_controller.ads_details_getbyId);
router.get('/get_myalladvertise',admaster_controller.advertise_getMyAll);
router.put('/:id/delete_advertise',admaster_controller.delete_myad);

router.post('/customer_validate_coupon',coupon_controller.checkValidation_coupon);

//Transaction History
//get_transaction_history
router.post('/get_transactionHistory',aUserWallet.get_transaction_history);
router.get('/get_wallet_balance',aUserWallet.get_wallet_balance);


//fileter ages
router.get('/getages', filter_controller.filter_age_details);
router.get('/getinterests', filter_controller.filter_interest_details);
router.get('/getrelations', filter_controller.filter_relation_details);
router.get('/getfamilymembers', filter_controller.filter_familymember_details);
router.get('/getoccupations', filter_controller.filter_occupation_details);
router.get('/getincomes', filter_controller.filter_income_details);
router.get('/geteducations', filter_controller.filter_education_details);
router.get('/getreligions', filter_controller.filter_religion_details);
router.get('/getcites', filter_controller.filter_city_details);
router.get('/getpincodes', filter_controller.filter_pincode_details);
router.get('/getstates', filter_controller.filter_state_details);
router.get('/countries', filter_controller.filter_country_details);

router.post('/upload_template_icon',fileupload_controller.ad_template_icon);
router.post('/upload_template_background',fileupload_controller.ad_template_background);
router.post('/upload_template_fullbanner',fileupload_controller.ad_template_fullbanner);
router.post('/upload_template_fullvideo',fileupload_controller.ad_template_fullvideo);
router.post('/upload_template_example',fileupload_controller.ad_template_example);//ad_template_fullvideo
router.post('/remove_file',fileupload_controller.delete_file);

router.post('/upload_help_desk',fileupload_controller.help_desk)
// user document upload
router.post('/upload_user_document',fileupload_controller.user_advertiser_document);
router.post('/upload_user_profile',fileupload_controller.user_advertiser_profile);

//wallet
router.post('/add_balance',aUserWallet.credit_balance);
router.post('/debit_balance',aUserWallet.debit_balance);

//Payment
router.post('/payment_charge',payment_controller.payment_charge);

//Transaction
router.post('/payment_online',Transaction_Controller.create_payment);
router.post('/payment_verify',Transaction_Controller.verify_payment)

// Dashboard 
//show_dashboard
router.get('/my_dashboard',dashboard.show_dashboard)

router.post('/paytm_test',withdraw_controller.paytm_payment)

router.post('/helpdesk_send_message',help_desk_controller.send_message)
router.post('/helpdesk_get_message',help_desk_controller.get_message)
//router.get('/generate_id',admaster_controller.ad_advertise_code)

//admin_user_start_pause_advertise
router.post('/download_bankwithdraw_excel',withdraw_controller.generateExcel)
router.post('/upload_excel_file',withdraw_controller.upload_excelfile)
//router.post('/test_excel_step1',withdraw_controller.uploadExcel)
//router.get('/generate_id',admaster_controller.ad_advertise_code)

module.exports = router;