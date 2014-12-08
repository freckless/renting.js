// RestComponent
// ==============
// Este component ocuparase de engadir todas as accións necesarias para un
// servicio REST ós controladores que sexa preciso.

'use strict';

// Dependencias do módulo
// ----------------------
var _ = require('lodash');

// Lóxica do compoñente
var restComponent = function(model, options) {
    options = options || {};
    
    var restconfig = {
        model: model,
        populate: options.populate || [],
        sort: options.sort || {_id: 1}
    };

    this.query = function(id) {
        if (typeof(id) === 'undefined') id = null;

        var query = restconfig.model;
        if (id) {
            query = query.findOne({_id: id});
        } else {
            query = query.find();
        }
        if (restconfig.populate) {
            _.each(restconfig.populate, function(relation) {
                query.populate(relation);
            });
        }
        if (restconfig.sort) {
            var key = Object.keys(restconfig.sort)[0];
            var direction = restconfig.sort[key];
            key = key.replace('$language', global.i18n.language);

            var sort = {};
            sort[key] = direction;
            query.sort(sort);
        }
        
        return query;
    };

    this.action_find_all = function(req, res) {
        this.query().exec(function(err, data) {
            if (err) {
                res.json({error: 'Problem with the request'});
            } else {
                res.json(data);
            }
        });
    };

    this.action_find_one = function(req, res) {
        this.query(req.params.id).exec(function(err, data) {
            if (err) {
                res.json({error: 'We can\'t found the object'});
            } else {
                res.json(data);
            }
        });
    };

    this.action_create = function(req, res) {
        var obj = new restconfig.model(req.body);
        obj.save(function(err, data) {
            if (err) {
                res.json({
                    status: 'error',
                    message: 'Some problem has been ocurred saving data',
                    explanation: err
                });
            } else {
                res.json(data);
            }
        });
    };

    this.action_update = function(req, res) {
        this.query(req.params.id).exec(function(err, data) {
            var newdata = _.extend(data, req.body);
            newdata.save(function(err) {
                if (err) {
                    res.json({
                        status: 'error',
                        message: 'Some problem has been ocurred updating data',
                        explanation: err
                    });
                } else {
                    res.json(data);
                }
            });
        });
    };

    this.action_remove = function(req, res) {
        this.query(req.params.id).exec(function(err, data) {
            if (err) {
                res.json({
                    status: 'error',
                    message: 'Some problem has been ocurred deleting object',
                    explanation: err
                });
            } else {
                data.remove(function() {
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