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
      console.error(err);
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
                "title": "Como funciona?",
                "payload": "como funciona"
              },
              {
                "content_type": "text",
                "title": "Lista de empresas",
                "payload": "lista de empresas"
              },
              {
                "content_type": "text",
                "title": "Tipos de avaliação",
                "payload": "tipos de avaliação"
              },
              {
                "content_type": "text",
                "title": "Avaliar empresa",
                "payload": "avaliar empresa"
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
  var body = {};
  if(!company && !evaluation){
    body = {
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
    body = {
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
    body = {
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
    body = {
      "speech": "Avaliando o " + evaluationHelper.name[evaluation] + " da " + companiesHelper.entityToName[company],
      "displayText": "Avaliando o " + evaluationHelper.name[evaluation] + " da " + companiesHelper.entityToName[company]
    };
    switch (evaluation) {
      case 'resolucao':
        evaluateResolution(company, res);
        break;
      case 'satisfacao':
        evaluateSatisfaction(company, res);
        break;
      case 'tempo':
        evaluateTime(company, res);
        break;
      case 'resposta':
        evaluateResponse(company, res);
        break;
      default:

    }
  }
}

function evaluateResolution(company, res){
  var totalComplaints = 0;
  var solved = 0;
  var notSolved = 0;
  var resolution = 0;
  complaintsService.findCompanyComplaints(companiesHelper.entityToDB[company])
    .then(function(complaints){
      totalComplaints = complaints.length;
      solved = complaints.reduce(function(a, b){
        return a + (b['avaliacao_resolvida'] === 'Resolvida' ? 1 : 0);
      }, 0);
      notSolved = totalComplaints - solved;
      resolution = parseInt((solved / totalComplaints)*100);
      if (resolution < 50)
        mood = "😡";
      else if (resolution >= 50 && resolution < 80)
        mood = "🙂";
      else if (resolution >= 80)
        mood = "😄";

      var text = "Essa é a análise do índice de resolução de problemas da " + companiesHelper.entityToName[company] + ":\n" +
        "\n- Total de reclamações: " + totalComplaints + ";\n" +
        "- Reclamações resolvidas: " + solved + ";\n" +
        "- Reclamações não resolvidas: " + notSolved + ";\n" +
        "- Índice de resolução: " + resolution + "% " + mood;
      var body = {
        "speech": text,
        "displayText": text
      };

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(body));
    })
    .catch(function (err) {
      console.error(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        "speech": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :(",
        "displayText": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :("
      }));
    });
}

function evaluateSatisfaction(company, res){
  var totalComplaints = 0;
  var sumGrades = 0;
  var averageGrades = 0;
  var grade1 = 0, grade2 = 0, grade3 = 0, grade4 = 0, grade5 = 0;
  var mood;
  complaintsService.findCompanyComplaints(companiesHelper.entityToDB[company])
    .then(function(complaints){
      totalComplaints = complaints.length;
      complaints.forEach(function(complain){
        sumGrades += complain['nota_consumidor'];
        switch (complain['nota_consumidor']) {
          case 1:
            grade1 ++;
            break;
          case 2:
            grade2 ++;
            break;
          case 3:
            grade3 ++;
            break;
          case 4:
            grade4 ++;
            break;
          case 5:
            grade5 ++;
            break;
        }
      });
      averageGrades = (sumGrades / totalComplaints).toFixed(1);
      if (averageGrades < 3)
        mood = "😡";
      else if (averageGrades >= 3 && averageGrades < 4)
        mood = "🙂";
      else if (averageGrades >= 4)
        mood = "😄";

      var text = "Essa é a análise do índice de satisfação dos clientes da " + companiesHelper.entityToName[company] + ":\n" +
        "\n- Total de reclamações: " + totalComplaints + ";\n" +
        "- Nota média: " + averageGrades + " " + mood + ";\n" +
        "\n Composição da nota: \n" +
        "⭐ (" + grade1 + ")\n" +
        "⭐⭐ (" + grade2 + ")\n" +
        "⭐⭐⭐ (" + grade3 + ")\n" +
        "⭐⭐⭐⭐ (" + grade4 + ")\n" +
        "⭐⭐⭐⭐⭐ (" + grade5 + ")\n";
      var body = {
        "speech": text,
        "displayText": text
      };

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(body));
    })
    .catch(function (err) {
      console.error(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        "speech": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :(",
        "displayText": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :("
      }));
    });
}

function evaluateTime(company, res){
  var totalComplaints = 0;
  var sumTime = 0;
  var averageTime = 0;
  var notAnswered = 0;
  complaintsService.findCompanyComplaints(companiesHelper.entityToDB[company])
    .then(function(complaints){
      totalComplaints = complaints.length;
      sumTime = complaints.reduce(function(a, b){
        if(b['tempo_resposta'])
          return a + b['tempo_resposta'];
        else{
          notAnswered ++;
          return a + 0;
        }
      }, 0);
      averageTime = (sumTime / (totalComplaints - notAnswered)).toFixed(1);

      var text = "Essa é a análise do tempo médio de resposta da " + companiesHelper.entityToName[company] + ":\n" +
        "\n- Total de reclamações: " + totalComplaints + ";\n" +
        "- Tempo de resposta: " + averageTime + " dias;\n";
      var body = {
        "speech": text,
        "displayText": text
      };

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(body));
    })
    .catch(function (err) {
      console.error(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        "speech": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :(",
        "displayText": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :("
      }));
    });
}

function evaluateResponse(company, res){
  var totalComplaints = 0;
  var answered = 0;
  var notAnswered = 0;
  var response = 0;
  complaintsService.findCompanyComplaints(companiesHelper.entityToDB[company])
    .then(function(complaints){
      totalComplaints = complaints.length;
      answered = complaints.reduce(function(a, b){
        return a + (b['respondida'] === 'S' ? 1 : 0);
      }, 0);
      notAnswered = totalComplaints - answered;
      response = parseInt((answered / totalComplaints)*100);
      if (response < 50)
        mood = "😡";
      else if (response >= 50 && response < 80)
        mood = "🙂";
      else if (response >= 80)
        mood = "😄";

      var text = "Essa é a análise do índice de resposta ao consumidor da " + companiesHelper.entityToName[company] + ":\n" +
        "\n- Total de reclamações: " + totalComplaints + ";\n" +
        "- Reclamações respondidas: " + answered + ";\n" +
        "- Reclamações não respondidas: " + notAnswered + ";\n" +
        "- Índice de resposta: " + response + "% " + mood;
      var body = {
        "speech": text,
        "displayText": text
      };

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(body));
    })
    .catch(function (err) {
      console.error(err);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        "speech": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :(",
        "displayText": "Desculpe, estou tendo problemas para acessar o banco de dados no momento :("
      }));
    });
  }
