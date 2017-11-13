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
    case 'rank_companies':
      rankCompanies(req, res);
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
            "text": "Olá, " + userData.first_name + "!\n" +
              "\nEu sou o Doctor Business e meu trabalho é avaliar empresas de telecomunicação segundo seus principais problemas, a satisfação de seus clientes, o índice de resolução dos problemas, o tempo médio de atendimento e o índice de respostas\n" +
              "\nMeu objetivo é te auxiliar na escolha do serviço mais adequado para você!\n" +
              "\nComo eu posso te ajudar?",
            "quick_replies": [
              {
                "content_type": "text",
                "title": "Como funciona?",
                "payload": "como funciona"
              },
              {
                "content_type": "text",
                "title": "Tipos de avaliação",
                "payload": "tipos de avaliação"
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
                "title": "Quem é você?",
                "payload": "quem e voce"
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
          "text": evaluationHelper.description[evaluation] + "Você quer que eu avalie uma empresa segundo este indicador?",
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
              "title": "Problemas",
              "payload": "problemas"
            },
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
            },
            {
              "content_type": "text",
              "title": "Nota geral",
              "payload": "nota geral"
            }
          ]
        }
      }
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(body));
  }

  else if(!incomplete && evaluation && company){

    switch (evaluation) {
      case 'problemas':
        evaluateProblems(company, res);
        break;
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
      case 'geral':
        evaluateGeneral(company, res);
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

      var text = "Essa é a análise do índice de resolução de problemas da *" + companiesHelper.entityToName[company] + "*:\n" +
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

      var text = "Essa é a análise do índice de satisfação dos clientes da *" + companiesHelper.entityToName[company] + "*:\n" +
        "\n- Total de reclamações: " + totalComplaints + ";\n" +
        "- Nota média: " + averageGrades + "/5 " + mood + ";\n" +
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

      var text = "Essa é a análise do tempo médio de resposta da *" + companiesHelper.entityToName[company] + "*:\n" +
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

      var text = "Essa é a análise do índice de resposta ao consumidor da *" + companiesHelper.entityToName[company] + "*:\n" +
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

function evaluateProblems(company, res){
  var totalComplaints = 0;
  var problems = [];
  var mainProblems = [];
  complaintsService.findCompanyComplaints(companiesHelper.entityToDB[company])
    .then(function(complaints){
      totalComplaints = complaints.length;
      problems = complaints.map(function(complain){
        return complain['problema'];
      }).sort();

      var clone = problems.slice();

      mainProblems = problems.sort(function(a, b) { //sort in reverse order of occurrence
    	  return (clone.lastIndexOf(b) - clone.indexOf(b) + 1) - (clone.lastIndexOf(a) - clone.indexOf(a) + 1);
    	})
      .filter(function(word, idx) { //remove duplicates
        return problems.indexOf(word) === idx;
      })
      .slice(0, 3);  //first 3 elements

      var text = "Essa é a análise dos principais problemas da *" + companiesHelper.entityToName[company] + "*:\n" +
        "\n- Total de reclamações: " + totalComplaints + ";\n" +
        "\nProblemas mais recorrentes:\n" +
        "\n- " + mainProblems[0] + ";\n" +
        "- " + mainProblems[1] + ";\n" +
        "- " + mainProblems[2] + ";";
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

function evaluateGeneral(company, res){
  var totalComplaints = 0;
  // resolution vars
  var solved = 0;
  var resolution = 0;
  // satisfaction vars
  var sumGrades = 0;
  var averageGrades = 0;
  // time vars
  var sumTime = 0;
  var averageTime = 0;
  var timeNotAnswered = 0;
  // response vars
  var answered = 0;
  var response = 0;
  // general vars
  var mood;
  var generalGrade = 0;

  complaintsService.findCompanyComplaints(companiesHelper.entityToDB[company])
    .then(function(complaints){
      totalComplaints = complaints.length;
      complaints.forEach(function(complain){
        solved += (complain['avaliacao_resolvida'] === 'Resolvida' ? 1 : 0);

        sumGrades += complain['nota_consumidor'];

        if(complain['tempo_resposta'])
          sumTime += complain['tempo_resposta'];
        else
          timeNotAnswered ++;

        answered += (complain['respondida'] === 'S' ? 1 : 0);

      });
      resolution = parseInt((solved / totalComplaints)*100);
      averageGrades = (sumGrades / totalComplaints).toFixed(1);
      averageTime = (sumTime / (totalComplaints - timeNotAnswered)).toFixed(1);
      response = parseInt((answered / totalComplaints)*100);

      generalGrade = ( (3*(averageGrades*2) + 3*(resolution/10) + (11 - averageTime) + (response/10)) / 8 ).toFixed(1);

      if (generalGrade < 5)
        mood = "😡";
      else if (generalGrade >= 5 && generalGrade < 7.5)
        mood = "🙂";
      else if (generalGrade >= 7.5)
        mood = "😄";

      var text = "Essa é a minha análise geral da *" + companiesHelper.entityToName[company] + "*:\n" +
        "\n- Total de reclamações: " + totalComplaints + ";\n" +
        "- Índice de resolução: " + resolution + "%;\n" +
        "- Nota dos clientes: " + averageGrades + "/5;\n" +
        "- Tempo de resposta: " + averageTime + " dias;\n" +
        "- Índice de resposta: " + response + "%;\n" +
        "\n- *Nota Geral*: " + generalGrade + "/10 " + mood;
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

function rankCompanies(req, res){
  var companiesList = [];
  var companiesTable = {};
  var companiesEval = [];

  // Getting all complaints
  complaintsService.getAllComplaintsFiltered()
    .then(function(complaints){

      // Grouping complaints by company
      complaints.forEach(function(complain){
        var companyName = companiesHelper.dbToEntity[complain['nome_fantasia']];

        if(companiesList.indexOf(companyName) < 0){
          companiesList.push(companyName);
          companiesTable[companyName] = [];
          companiesTable[companyName].push(complain);
        }
        else{
          companiesTable[companyName].push(complain);
        }
      });

      // Evaluating each company
      companiesList.forEach(function(company){
        var totalComplaints = 0;
        // resolution vars
        var solved = 0; var resolution = 0;
        // satisfaction vars
        var sumGrades = 0; var averageGrades = 0;
        // time vars
        var sumTime = 0; var averageTime = 0; var timeNotAnswered = 0;
        // response vars
        var answered = 0; var response = 0;
        // general vars
        var mood = ""; var generalGrade = 0;

        totalComplaints = companiesTable[company].length;

        companiesTable[company].forEach(function(complain){
          solved += (complain['avaliacao_resolvida'] === 'Resolvida' ? 1 : 0);

          sumGrades += complain['nota_consumidor'];

          if(complain['tempo_resposta'])
            sumTime += complain['tempo_resposta'];
          else
            timeNotAnswered ++;

          answered += (complain['respondida'] === 'S' ? 1 : 0);
        });
        resolution = parseInt((solved / totalComplaints)*100);
        averageGrades = (sumGrades / totalComplaints).toFixed(1);
        averageTime = (sumTime / (totalComplaints - timeNotAnswered)).toFixed(1);
        response = parseInt((answered / totalComplaints)*100);

        generalGrade = ( (3*(averageGrades*2) + 3*(resolution/10) + (11 - averageTime) + (response/10)) / 8 ).toFixed(1);

        if (generalGrade < 5)
          mood = "😡";
        else if (generalGrade >= 5 && generalGrade < 7.5)
          mood = "🙂";
        else if (generalGrade >= 7.5)
          mood = "😄";

        companiesEval.push({
          name: companiesHelper.entityToName[company],
          totalComplaints: totalComplaints,
          grade: generalGrade,
          mood: mood
        });
      });

      companiesEval.sort(function(a,b){
        return (a.grade > b.grade) ? -1 : ((b.grade > a.grade) ? 1 : 0);
      });

      var text = "Este é o ranking das empresas segundo minha avaliação geral: \n";
      var text2 = "\nEu encontrei poucas informações sobre algumas empresas (possuem menos de 100 reclamações) e por isso elas foram avaliadas separadamente: \n";
      var needText2 = false;
      var count = 1;
      var count2 = 1;
      // Structuring the text
      companiesEval.forEach(function(company){
        if(company.totalComplaints > 100){
          text += count + ". *" + company.name + "*:\n" +
                  "  - Reclamações: " + company.totalComplaints + ";\n" +
                  "  - Nota: " + company.grade + " " + company.mood +";\n\n";
          count ++;
        }
        else{
          text2 += count2 + ". *" + company.name + "*:\n" +
                  "  - Reclamações: " + company.totalComplaints + ";\n" +
                  "  - Nota: " + company.grade + " " + company.mood +";\n\n";
          count2 ++;
          needText2 = true;
        }
      });

      text = needText2 ? text + text2 : text;
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
