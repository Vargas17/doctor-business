module.exports = {
  description: {
    resolucao: 'O *índice de resolução dos problemas* avalia a porcentagem média de problemas que foram resolvidos com sucesso pela empresa. É muito útil para saber a eficiência do atendimento realizado ;)\n\n',
    satisfacao: 'O *índice de satisfação do consumidor* é baseado em uma nota de 1 a 5 dada pelo consumidor à respeito do atendimento realizado. Esse é um bom indicativo da qualidade do atendimento ;)\n\n',
    tempo: 'O *tempo médio de resposta* é a média, em dias, que a empresa demora para resolver um problema, desde a abertura deste por parte do cliente até a finalização do atendimento.\n\n',
    resposta: 'O *índice de resposta ao consumidor* indica a porcentagem de reclamações que a empresa respondeu. Note que esse indicador avalia se a empresa pelo menos responde seus clientes, mas não mede a resolução de fato dos problemas.\n\n',
    problemas: 'Os *principais problemas da empresa* indicam quais são as reclamações mais recorrentes por parte dos clientes.\n\n',
    geral: 'A *nota geral* de uma empresa é minha análise e de certa forma minha opinião sobre ela ;).\nEssa avaliação é baseada em uma fórmula que leva em conta vários fatores da empresa, resultando em uma nota que vai de 0 a 10.\n\n'
  },
  name: {
    resolucao: 'índice de resolução',
    satisfacao: 'índice de satisfação',
    tempo: 'tempo médio de resposta',
    resposta: 'índice de resposta ao consumidor',
    problemas: 'principais problemas',
    geral: 'nota geral'
  },
  dbKey: {
    resolucao: 'avaliacao_resolvida',
    satisfacao: 'nota_consumidor',
    tempo: 'tempo_resposta',
    resposta: 'respondida',
    problemas: 'problema'
  }
}
