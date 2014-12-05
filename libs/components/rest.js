'use strict';

var _ = require('lodash');

var restComponent = function(model, populate) {
    var restconfig = {
        model: model,
        populate: populate || []
    };

    this.query = function(id) {
        if (typeof(id) === 'undefined') id = null;
        var query = restconfig.model.find(id);
        if (this.populate) {
            _.each(populate, function(relation) {
                query.populate(relation);
            });
        }
        return query;
    };

    this.action_find_all = function(req, res) {
        this.query().exec(function(err, data) {
            if (err) {
                res.json({error: 'Problem with users request'});
            } else {
                res.json(data);
            }
        });
    };

    this.action_find_one = function(req, res) {
        restconfig.model.findById(req.params.id).populate('country').exec(function(err, data) {
            if (err) {
                res.json({error: 'We can\'t found this user'});
            } else {
                res.json(data);
            }
        });
    };

    this.action_create = function(req, res) {
        var obj = new this.model(req.body);
        obj.save(function(err) {
            if (err) {
                res.json({
                    status: 'error',
                    message: 'Some problem has been ocurred saving data',
                    explanation: err
                });
            } else {
                res.json({
                    status: 'OK'
                });
            }
        });
    };

    this.action_update = function(req, res) {
        restconfig.model.findById(req.params.id).exec(function(err, user) {
            var newdata = _.extend(user, req.body);
            newdata.save(function(err) {
                if (err) {
                    res.json({
                        status: 'error',
                        message: 'Some problem has been ocurred updating data',
                        explanation: err
                    });
                } else {
                    res.json({
                        status: 'OK'
                    });
                }
            });
        });
    };

    this.action_remove = function(req, res) {
        restconfig.model.findById(req.params.id).exec(function(err, user) {
            if (err) {
                res.json({
                    status: 'error',
                    message: 'Some problem has been ocurred deleting object',
                    explanation: err
                });
            } else {
                user.remove(function() {
                    res.json({
                        status: 'OK'
                    });
                });
            }
        });
    };

    return this;
};

module.exports = restComponent;