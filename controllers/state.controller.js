const State = require('../models/state.model');
const Country = require('../models/country.model');
const CommonFile = require('../constant')
//ObjectId = require('mongodb').ObjectID;

exports.state_create = function (req, res) {
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
        let state = new State(
            {
                country_id:req.body.country_id,
                name: req.body.name
            }
        );
        Country.findOne( {  _id : new ObjectId(req.body.country_id) }, function(err, object){
            if (object)
            {
                //update
                State.findOne( {  name :  req.body.name , country_id:req.body.country_id }, function(err, object){
                    if (object) {
                        //update
                       return res.send({ status : 0 , msg : "state already existed."})
                    } else {
                        //insert
                        state.save(function (err) {
                        // console.log(err);
                            if (err)
                           return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                            else
                           return res.send({ status : 1 , msg : "state insert successfully." , data :state});
                        })
                    }
                });
            }
            else
                res.send({ status : 0 , msg : "country not found."})
        });
    }})
};

exports.Allstate_details = function (req, res) {
    State.find({}, function (err, state) {
        if (err)
       return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
           // if(JSON.stringify(state, null, 2).length > 2)
          return  res.send({ status : 1 , msg : "state listed successfully." , data :state});
            //else
           // res.send({ status : 0 , msg : "no state found."}));
        }
        
    })
};

exports.state_details_By_countryId = function (req, res) {
    State.find({  country_id:req.body.country_id}, function (err, state) {
        if (err)
       return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
            if(JSON.stringify(state, null, 2).length > 2)
           return res.send({ status : 1 , msg : "state listed successfully." , data :state});
            else
           return res.send({ status : 0 , msg : "no state found."});
        }
        
    })
};

exports.state_update = function (req, res) 
{
    //console.log(JSON.stringify(req.body, null, 2));
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
        State.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, state) 
        {
            //console.log(state);
            if (err) 
           return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
            else
           return res.send({ status : 1 , msg : "state updated successfully."});
        });
    }})
};
exports.state_delete = function (req, res) {
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
        State.findByIdAndRemove(req.params.id, function (err) {
            if (err) 
           return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
            else
           return res.send({ status : 1 , msg : "state deleted successfully."});
        })
    }})
};

/*
exports.state_details = function (req, res) {
    State.find({}, function (err, state) {
        if (err) return next(err);
        res.send(state);
    })
};*/