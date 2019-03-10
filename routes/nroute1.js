const express = require('express');
const router = express.Router();


const nuser_controller = require('../controllers/nuser_controllers/nuser.controller');
const fileupload_controller = require('../controllers/fileupload.controller');

const country_controller = require('../controllers/country.controller');
const city_controller = require('../controllers/city.controller');
const state_controller = require('../controllers/state.controller');
const pincode_controller = require('../controllers/pincode.controller');
const filter_controller = require('../controllers/filter_Data.controller');

const adserve = require('../controllers/nuser_controllers/AdServe.controller')
const nuserDocument_controller = require('../controllers/nuser_controllers/nuser_document.controller')
const nUser_Wallet_controller = require('../controllers/nuser_wallet.controller')

const referral_user_controller = require('../controllers/referral_users.controller')
const nuser_bankDetails_controller = require('../controllers/nuser_controllers/nuser_bankdetails.controller')

const withdraw_controller = require('../controllers/withdraw_request.controller')

const adPriceTier_controller = require('../controllers/adPriceTier.controller');

const notification_controller = require('../controllers/Notification_Controller/notification.controller')
const helpdesk_controller = require('../controllers/helpdesk_controller/helpdesk.controller')

const testcron_controller = require('../controllers/Crons/custom_cron.controller')

router.post('/register_user', nuser_controller.user_create);
router.post('/send_otp', nuser_controller.user_send_otp);
router.post('/verify_otp', nuser_controller.user_verify_otp);
router.post('/update_profile', nuser_controller.user_update_profile);
router.post('/upload_help_desk',fileupload_controller.help_desk)
router.get('/get_profile', nuser_controller.getuser_profile);
router.get('/logout',nuser_controller.logout)

router.get('/getallcountry', country_controller.country_details);
router.post('/getstate_bycountry', state_controller.state_details_By_countryId);
router.post('/getcity_bystate', city_controller.city_details_By_stateId);
router.post('/getpincode_bycity', pincode_controller.pincode_details_By_cityId);
router.get('/getinterests', filter_controller.filter_interest_details);
router.get('/getrelations', filter_controller.filter_relation_details);
router.get('/getfamilymembers', filter_controller.filter_familymember_details);
router.get('/getoccupations', filter_controller.filter_occupation_details);
router.get('/getincomes', filter_controller.filter_income_details);
router.get('/geteducations', filter_controller.filter_education_details);
router.get('/getreligions', filter_controller.filter_religion_details);

router.post('/getpincodewith_city',pincode_controller.getpincode_with_city)

router.post('/upload_user_document',fileupload_controller.user_user_document);
router.post('/upload_user_profile',fileupload_controller.user_user_profile);

router.get('/get_bankdetails',nuser_bankDetails_controller.get_bankaccount)
router.post('/add_bankdetails',nuser_bankDetails_controller.add_bankaccount)
router.post('/update_bankdetails',nuser_bankDetails_controller.update_bankaccount)

router.post('/document_update',nuserDocument_controller.add_document);
router.get('/get_documents',nuserDocument_controller.get_document);
//get_documents

router.post('/enduser_approve',nuser_controller.admin_user_approve)
router.get('/getadvertise',adserve.getAdvertise1);
router.post('/getadvertisedetail',adserve.getAdvertiseDetails)
router.post('/start_adshow',adserve.start_adshow)
router.post('/finish_adshow',adserve.finish_adshow)
//router.post('/downline',adserve.get_downlevel)

router.get('/mybalance',nUser_Wallet_controller.getwalletbalance)
router.get('/mywallethistory',nUser_Wallet_controller.getwallethistory)
router.post('/get_earninig',nUser_Wallet_controller.get_earninig)

router.get('/get_myteam',referral_user_controller.get_my_referralusers)
router.post('/get_level_person',referral_user_controller.get_myteam_level_first_level)
router.get('/getuser_upper_referrals',referral_user_controller.get_my_upperreferralusers)

router.post('/send_withdraw_request',withdraw_controller.add_withdraw_request)
router.get('/get_withdraw_list',withdraw_controller.get_withdraw_list_foruser)

router.get('/get_withdraw_charge',adPriceTier_controller.get_witdrawal_setting_charget)

router.get('/get_notification',notification_controller.getNotification)
router.post('/read_notification',notification_controller.readnotification)

router.post('/helpdesk_create_message',helpdesk_controller.send_message)
router.post('/helpdesk_get_message',helpdesk_controller.get_message)



// Testing to send custom point
router.post('/cron_test',testcron_controller.update_downline_temp)// temp point update
router.post('/cron_test_1',testcron_controller.update_final_wallet)// credit in account wallet
module.exports = router;
