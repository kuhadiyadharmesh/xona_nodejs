const City = require('../models/city.model');
const State = require('../models/state.model');
const CommonFile = require('../constant')

exports.city_create = function (req, res) {
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
            res.send({status:0 , msg : err})
        }
        else
        {
        let city = new City(
            {
                state_id:req.body.state_id,
                name: req.body.name
            }
        );

        State.findOne( {  _id : req.body.state_id }, function(err, object){
            if (object)
            {
                //update
                City.findOne( {  name :  req.body.name , state_id:req.body.state_id }, function(err, object){
                    if (object) {
                        //update
                        res.send({ status : 0 , msg : "city already existed."})
                    } else {
                        //insert
                        city.save(function (err) {
                        // console.log(err);
                            if (err)
                            res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                            else
                            res.send({ status : 1 , msg : "city insert successfully." , data :city});
                        })
                    }
                });
            }
            else
                res.send({ status : 0 , msg : "state not found."})
        });
    }})
};
exports.city_details_By_stateId = function (req, res) {
    City.find({  state_id:req.body.state_id }, function (err, city) {
        if (err)
        res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
        else
        {
            //console.log(JSON.stringify(country, null, 2));
            //if(JSON.stringify(city, null, 2).length > 2)
            res.send({ status : 1 , msg : "city listed successfully." , data :city});
            //else
            //res.send({ status : 0 , msg : "no city found."});
        }
        
    })
};

exports.city_update = function (req, res) 
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
            City.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, city) 
            {
                //console.log(state);
                if (err) 
               return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                else
               return res.send({ status : 1 , msg : "city updated successfully."});
            });
        }})
};
exports.city_delete = function (req, res) {
    CommonFile.admin_auth(req.headers.token , (err , value)=>
    {
        if(err)
        {
           return res.status(401).send({status:0 , msg : err})
        }
        else
        {
            City.findByIdAndRemove(req.params.id, function (err) {
                if (err) 
               return res.send({ status : 0 , msg : "something gone wrong." , err : err}); 
                else
               return res.send({ status : 1 , msg : "city deleted successfully."});
            })
        }})
};