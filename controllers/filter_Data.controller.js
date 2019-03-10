const Age = require('../models/age.model');
const Interest = require('../models/interest.model');
const Relation = require('../models/relationship.model');
const FMember = require('../models/familym.model');
const Occupation = require('../models/occupation.model');
const Income = require('../models/income.model');
const Education = require('../models/education.model');
const Religion = require('../models/religion.model');
const City = require('../models/city.model');
const Pincode = require('../models/pincode.model');
const State = require('../models/state.model');
const Country = require('../models/country.model');
const Common = require('../constant.js')


exports.filter_age_details = function (req, res) {
    Age.find({}, function (err, age) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
            //if(JSON.stringify(age, null, 2).length > 2)
            res.send({ status : 1 , msg : "age listed successfully." , filter_type : 1 , data :age});
            //else
            //res.send({ status : 0 , msg : "no age found."});
        }
        
    })
};
exports.filter_city_details = function (req, res) 
{
    let d = req.query.search;
    /*
    Common.get_adPrice_tier(d,(error, value) =>{
        if(error)
        {
            console.log(error);
            req.send(error);
        }
        else
        {
            console.log(value);
           
        }
    })
    */
    
    
    City.find({'name' : new RegExp(d, 'i') }, function (err, city) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
            //if(JSON.stringify(city, null, 2).length > 2)
            res.send({ status : 1 , msg : "city listed successfully." , filter_type : 6 , data :city});
           // else
           // res.send({ status : 0 , msg : "no city found."});
        }
        
    })
    
};
exports.filter_pincode_details = function (req, res) {
    let d = req.query.search;
    Pincode.find({'pincode' : new RegExp(d, 'i')}, function (err, pincode) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
           // if(JSON.stringify(pincode, null, 2).length > 2)
            res.send({ status : 1 , msg : "pincode listed successfully." , filter_type : 3 , data :pincode});
           // else
           // res.send({ status : 0 , msg : "no pincode found."});
        }
        
    })
};

exports.filter_state_details = function (req, res) {
    let d = req.query.search;
    State.find({'name' : new RegExp(d, 'i')}, function (err, state) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
            //if(JSON.stringify(state, null, 2).length > 2)
            res.send({ status : 1 , msg : "state listed successfully." , filter_type : 5 , data :state});
            //else
            //res.send({ status : 0 , msg : "no state found."});
        }
        
    })
};
exports.filter_country_details = function (req, res) {
    let d = req.query.search;
    Country.find({'name' : new RegExp(d, 'i')}, function (err, country) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
           // if(JSON.stringify(country, null, 2).length > 2)
            res.send({ status : 1 , msg : "country listed successfully." , filter_type : 4 , data :country});
            //else
           // res.send({ status : 0 , msg : "no country found."});
        }
        
    })
};

exports.filter_interest_details = function (req, res) {
    Interest.find({}, function (err, interest) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
           // if(JSON.stringify(interest, null, 2).length > 2)
            res.send({ status : 1 , msg : "interest listed successfully.", filter_type : 7 , data :interest});
            //else
           // res.send({ status : 0 , msg : "no interest found."});
        }
    })
};

exports.filter_relation_details = function (req, res) {
    Relation.find({}, function (err, relationship) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
           // if(JSON.stringify(relationship, null, 2).length > 2)
            res.send({ status : 1 , msg : "relationship listed successfully." , filter_type : 8, data :relationship});
           // else
           // res.send({ status : 0 , msg : "no relationship found."});
        }
        
    })
};

exports.filter_familymember_details = function (req, res) {
    FMember.find({}, function (err, familym) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
          //  if(JSON.stringify(familym, null, 2).length > 2)
            res.send({ status : 1 , msg : "family member listed successfully.", filter_type : 13 , data :familym});
           // else
           // res.send({ status : 0 , msg : "no family member found."});
        }
        
    })
};

exports.filter_occupation_details = function (req, res) {
    Occupation.find({}, function (err, occupation) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
          //  if(JSON.stringify(occupation, null, 2).length > 2)
            res.send({ status : 1 , msg : "occupation  listed successfully.", filter_type : 9 , data :occupation});
           // else
           // res.send({ status : 0 , msg : "no occupation found."});
        }
        
    })
};

exports.filter_income_details = function (req, res) {
    Income.find({}, function (err, income) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
           // if(JSON.stringify(income, null, 2).length > 2)
            res.send({ status : 1 , msg : "income  listed successfully.", filter_type : 10 , data :income});
          //  else
           // res.send({ status : 0 , msg : "no income found."});
        }
    })
};

exports.filter_education_details = function (req, res) {
    Education.find({}, function (err, education) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
           // if(JSON.stringify(education, null, 2).length > 2)
            res.send({ status : 1 , msg : "education  listed successfully." , filter_type : 11, data :education});
           // else
           // res.send({ status : 0 , msg : "no education found."});
        }
        
    })
};

exports.filter_religion_details = function (req, res) {
    
    Religion.find({}, function (err, religion) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
           // if(JSON.stringify(religion, null, 2).length > 2)
            res.send({ status : 1 , msg : "education  listed successfully." , filter_type : 12, data :religion});
          //  else
           // res.send({ status : 0 , msg : "no education found."});
        }
        
    })
};