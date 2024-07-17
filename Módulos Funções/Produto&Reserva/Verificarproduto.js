const mysql = require("mysql2");
const modulosImportados = require("../Importacoes/Imports");

const pool = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  connectionLimit: 10,
});

const secretoMenu = async (client, message, estadoUsuario) => {
  let Buscar = message.body;
  console.log(Buscar);
  pool.query(
    "",
    [`%${Buscar}%`],
    (error, results, fields) => {
      if (results.length > 0) {
        const codigo = results[0].codigo;
        const descricao = results[0].descricao;
        const saldo = results[0].saldo;
        const precovenda = results[0].precovenda;
        const res = `Codigo: *${codigo}*\n Descrição: *${descricao}*\n Saldo Deposito: *${saldo}*\n Preço de venda: R$*${precovenda}*`;
        client.sendText(message.from, res);
        modulosImportados.enviarMenuPrincipal(client, message, estadoUsuario);
      }
    }
  );
};
module.exports = {
  secretoMenu,
};
