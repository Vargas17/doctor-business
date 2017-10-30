var database = require('../configs/database');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(database.development.url, { native_parser: true });
db.bind('reclamacoes');

var service = {}
service.listAllCompanies = listAllCompanies;

module.exports = service;

function listAllCompanies() {
  var deferred = Q.defer();
  db.reclamacoes.distinct('nome_fantasia', function (err, companies){
    if (err) deferred.reject(err.name + ': ' + err.message);

    companies = _.map(companies, function(company){
      return company;
    });

    deferred.resolve(companies);
  });

  return deferred.promise;
}
