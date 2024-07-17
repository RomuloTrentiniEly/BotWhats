const mysql = require('mysql2');
const modulosImportados = require("../Importacoes/Imports");
const pool = mysql.createPool({
  host: '',
  user: '',
  password: '',
  database: '',
  connectionLimit: 10,
});




const Verificarreserva = (client, message, estadoUsuario) => {
  const remetente = message.from;
  const numeroSemSufixo = remetente.replace(/@c.us/g, '');

  pool.query(
    '',
    [numeroSemSufixo],
    (error, results, fields) => {
      if (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        return;
      }

      if (results.length > 0) {         
            const mensagem = `Digite o número da vn que deseja informações:🕵️`;

            client.sendText(message.from, mensagem);
            controle2 = true;
          } else{
            const resp = `Você não possui autorização para utilizar essa Área`
            client.sendText(message.from, resp);
            modulosImportados.enviarMenuPrincipal(client, message, estadoUsuario);
          }
        }
      
    
  );
      }

module.exports = {

  Verificarreserva,
};
