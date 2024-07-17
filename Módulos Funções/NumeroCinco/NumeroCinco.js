const mysql = require('mysql2');
const ProtocoloAtendi = require('../Importacoes/ProtocoloAtend')
const modulosImportados = require('../Importacoes/Imports');

const pool = mysql.createPool({
  host: '',
  user: '',
  password: '',
  database: '',
  connectionLimit: 50, // Número máximo de conexões simultâneas
});



const opcao5 = async (client, message, estadoUsuario) => {
  try {
    const resumo = message.body;
    const numeroSemSufixo = message.from.replace(/@c.us/g, '');
    const numeroFormatado = ProtocoloAtendi.formatarNumeroTelefone(numeroSemSufixo);
    const numeroProtocolo = ProtocoloAtendi.gerarNumeroProtocolo(numeroSemSufixo);

    const results = await new Promise((resolve, reject) => {
      pool.query('', [numeroProtocolo], (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    if (!results.length) {
      console.log('Mensagem do Usuário:', message.body);
      console.log('Sugestão:', resumo);
      console.log('Número do Cliente:', numeroSemSufixo);

      const numeroProtocoloGerado = await ProtocoloAtendi.inserirAtendimento(numeroFormatado, resumo, numeroProtocolo);

      
      setTimeout(() => {
        ProtocoloAtendi.processarDepoisDeIntervalo(client, message, estadoUsuario, resumo, numeroSemSufixo, numeroFormatado, numeroProtocolo, numeroProtocoloGerado);
      }, 15000);
    } else {
      const resposta = `*Você já possui um chamado em aberto*`
      client.sendText(message.from, resposta);
      modulosImportados.enviarMenuPrincipal(client, message, estadoUsuario);
    }
  } catch (error) {
    console.error('Erro ao executar a função opcao7:', error);
    client.sendText(message.from, 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
  }
};







  
  module.exports = {
    opcao5,
  };
  