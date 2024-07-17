const mysql = require("mysql2");
const modulosImportados = require("../Importacoes/Imports");

const pool = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  connectionLimit: 10,
}).promise();

const secretoMenu = async (client, message, estadoUsuario) => {
  let Buscar = message.body;
  console.log(Buscar);

  try {
    const [results, fields] = await pool.query(
      "",
      [`%${Buscar}%`]
    );

    if (results.length > 0) {
      const { codigo, descricao, saldo, precovenda } = results[0];
      const res = `Codigo: *${codigo}*\n Descrição: *${descricao}*\n Saldo Deposito: *${saldo}*\n Preço de venda: R$*${precovenda}*`;
      await client.sendText(message.from, res);
      modulosImportados.enviarMenuPrincipal(client, message, estadoUsuario);
    } else {
      await client.sendText(message.from, "Nenhum item encontrado.");
    }
  } catch (error) {
    console.error("Erro ao acessar o banco de dados:", error);
    await client.sendText(message.from, "Desculpe, houve um problema ao processar sua solicitação. Tente novamente mais tarde.");
  }
};

module.exports = {
  secretoMenu,
};
