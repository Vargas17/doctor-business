var database = require('../configs/database');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(database.development.url, { native_parser: true });
db.bind('reclamacoes');

var service = {}
service.listAllCompanies = listAllCompanies;
service.findCompanyComplaints = findCompanyComplaints;

module.exports = service;

function listAllCompanies() {
  var deferred = Q.defer();
  db.reclamacoes.distinct('nome_fantasia', function (err, companies){
    if (err) deferred.reject(err.name + ': ' + err.message);

    deferred.resolve(companies);
  });

  return deferred.promise;
}

function findCompanyComplaints(company) {
  var deferred = Q.defer();
  db.reclamacoes.find({nome_fantasia : { $in: company }}).toArray(function(err, complaints){
    if (err) deferred.reject(err.name + ': ' + err.message);

    deferred.resolve(complaints);
  });
  
  return deferred.promise;
}
