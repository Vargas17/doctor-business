var express = require('express');
var router = express.Router();
var complaintsService = require('../services/complaints.service');
var userService =  require('../services/user.service');
var companiesHelper = require('../helpers/companies.helper');
var evaluationHelper = require('../helpers/evaluation.helper');

router.post('/', manageRequests);

module.exports = router;

function manageRequests(req, res){
  var action = req.body.result.action;
  console.log('Request recebido');
  console.log('Action: ', action);

  switch (action) {
    case 'input.welcome':
      welcome(req, res);
      break;
    case 'list_companies':
      listAllCompanies(req, res);
      break;
    case 'list_companies.list_companies-evaluate.list_companies-evaluate-yes':
      evaluateCompany(req, res);
      break;
    case 'list_companies.list_companies-evaluate.list_companies-evaluate-yes.list_companies-evaluate-yes-evaluate':
      evaluateCompany(req, res);
      break;
    case 'evaluation_type.evaluation_type-describe':
      explainEvaluation(req, res);
      break;
    case 'evaluation_type.evaluation_type-describe.evaluation_type-describe-yes':
      evaluateCompany(req, res);
      break;
    case 'evaluation_type_description':
      explainEvaluation(req, res);
      break;
    case 'evaluation_type_description.evaluation_type_description-yes':
      evaluateCompany(req, res);
      break;
    case 'evaluate_company':
      evaluateCompany(req, res);
      break;
    case 'evaluate_company_confirmation.evaluate_company_confirmation-yes':
      evaluateCompany(req, res);
      break;
    case 'evaluate_company_confirmation.evaluate_company_confirmation-yes.evaluate_company_confirmation-yes-evaluate':
      evaluateCompany(req, res);
      break;
    default:

  }

}

function listAllCompanies(req, res){
  complaintsService.listAllCompanies()
    .then(function(companies){

      var filteredCompanies = [];
      companies.forEach(function(company){
        var companyName = companiesHelper.dbToName[company];
        if(filteredCompanies.indexOf(companyName) < 0)
          filteredCompanies.push(companyName);
      });

      var formatedList = filteredCompanies.join('\n');
      var body = {
        "speech": "Essa é a lista de empresas para avaliação: \n" + formatedList,
        "displayText": "Essa é a lista de empresas para avaliação: \n" + formatedList
      };

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(body));
    })
    .catch(function (err) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        "speech": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :(",
        "displayText": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :("
      }));
    });
}

function welcome(req, res){
  var userId = req.body.originalRequest ? (req.body.originalRequest.source === 'facebook' ? req.body.originalRequest.data.sender.id : '') : '';
  if (userId){
    userService.getFacebookData(userId, function(err, userData){
      var body = {
        "speech": "Olá, " + userData.first_name,
        "displayText": "Olá, " + userData.first_name,
        "data": {
          "facebook": {
            "text": "Olá, " + userData.first_name + "!\nComo eu posso te ajudar?",
            "quick_replies": [
              {
                "content_type": "text",
                "title": "Quem é você?",
                "payload": "quem e voce"
              },
              {
                "content_type": "text",
                "title": "Lista de empresas",
                "payload": "lista de empresas"
              },
              {
                "content_type": "text",
                "title": "Avaliar empresa",
                "payload": "avaliar empresa"
              },
              {
                "content_type": "text",
                "title": "Tipos de avaliação",
                "payload": "tipos de avaliação"
              },
              {
                "content_type": "text",
                "title": "Como funciona?",
                "payload": "como funciona"
              }
            ]
          }
        }
      };
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(body));
    });
  }
}

function explainEvaluation(req, res){
  var evaluation = req.body.result.parameters.evaluation ? req.body.result.parameters.evaluation : '';
  if (evaluation) {
    var body = {
      "speech": evaluationHelper.description[evaluation],
      "displayText": evaluationHelper.description[evaluation],
      "data": {
        "facebook": {
          "text": evaluationHelper.description[evaluation] + "Deseja avaliar uma empresa segundo este indicador?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Sim",
              "payload": "sim"
            },
            {
              "content_type": "text",
              "title": "Não",
              "payload": "nao"
            }
          ]
        }
      }
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  }
}

function evaluateCompany(req, res){
  var incomplete = req.body.result.actionIncomplete;
  var evaluation = req.body.result.contexts[0] ? (req.body.result.contexts[0].parameters.evaluation ? req.body.result.contexts[0].parameters.evaluation : '') : '';
  var company = req.body.result.contexts[0] ? (req.body.result.contexts[0].parameters.company ? req.body.result.contexts[0].parameters.company : '') : '';

  if(!company && !evaluation){
    var body = {
      "speech": "Qual empresa você quer avaliar??",
      "displayText": "Qual empresa você quer avaliar?",
      "data": {
        "facebook": {
          "text": "Qual empresa você quer avaliar?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Lista de empresas",
              "payload": "lista de empresas"
            }
          ]
        }
      }
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  }

  else if(!company && evaluation){
    var body = {
      "speech": "Qual empresa você quer avaliar??",
      "displayText": "Qual empresa você quer avaliar?",
      "data": {
        "facebook": {
          "text": "Qual empresa você quer avaliar?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Lista de empresas",
              "payload": "lista de empresas"
            }
          ]
        }
      }
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  }

  else if(company && !evaluation){
    var body = {
      "speech": "Qual método de avaliação você quer usar?",
      "displayText": "Qual método de avaliação você quer usar?",
      "data": {
        "facebook": {
          "text": "Qual método de avaliação você quer usar?",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Resolução",
              "payload": "resolucao"
            },
            {
              "content_type": "text",
              "title": "Satisfação",
              "payload": "satisfacao"
            },
            {
              "content_type": "text",
              "title": "Tempo",
              "payload": "tempo"
            },
            {
              "content_type": "text",
              "title": "Respostas",
              "payload": "respostas"
            }
          ]
        }
      }
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  }

  else if(!incomplete && evaluation && company){
    var body = {
      "speech": "Avaliando o " + evaluationHelper.name[evaluation] + " da " + companiesHelper.entityToName[company],
      "displayText": "Avaliando o " + evaluationHelper.name[evaluation] + " da " + companiesHelper.entityToName[company]
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  }
}
