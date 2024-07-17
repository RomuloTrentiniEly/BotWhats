const mysql = require("mysql2");
const modulosImportados = require("../Importacoes/Imports");

// Configurações de conexão com o banco de dados
const pool = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  connectionLimit: 50, // Número máximo de conexões simultâneas
});
let controle2 = false;

// Função principal
const Numeroum = async (
  client,
  message,
  estadoUsuario,
  estadoCompartilhado
) => {
  if (!estadoCompartilhado) {
    estadoCompartilhado = {
      controleErro: true,
    };
  }
  controle2 = true;
  if (controle2 === true && estadoCompartilhado.controleErro === true) {
    const Buscar = message.body.replace(/\s/g, "");
    console.log(Buscar);
    let aguarde = "*Estamos localizando os dados da sua compra.*\n*Aguarde...*";
    client.sendText(message.from, aguarde);

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Erro ao obter conexão do pool:", err);
        // Tratar erro, se necessário
        return;
      }

      function testarVendas() {
        connection.query(
          "",
          [`%${Buscar}%`],

          (error, results, fields) => {
            const pattern = /^vn-[0-9]{8}\/.{2}$/i;
            if (results.length > 0 && pattern.test(Buscar)) {
              const clientes = results[0].cliente;
              const empresa = results[0].empresa;
              const numero = results[0].numero;
              const dataCompra = results[0].data;
              const dataOriginal = new Date(dataCompra);
              const dia = String(dataOriginal.getDate()).padStart(2, "0");
              const mes = String(dataOriginal.getMonth() + 1).padStart(2, "0");
              const ano = dataOriginal.getFullYear();

              const dataCompraa = `${dia}/${mes}/${ano}`;

              let respostausuario = `*Olá* ${clientes}, \n*Você comprou na loja:* ${empresa}\n*Número:* ${numero}\n*Data da compra:* ${dataCompraa}`;
              client.sendText(message.from, respostausuario);

              setTimeout(() => {
                if (
                  results[0].prazoentrega === null &&
                  results[0].dataentrega === null
                ) {
                  const resposta =
                    "Você Optou por não utilizar o nosso serviço de Entrega.";
                  client.sendText(message.from, resposta);
                  // Chama a função enviarMenuPrincipal
                  modulosImportados.enviarMenuPrincipal(
                    client,
                    message,
                    estadoUsuario
                  );
                  connection.release();
                } else {
                  if (results.length > 0 && results[0].dataentrega != null) {
                    console.log("Dentro do bloco if (results.length > 0)");

                    console.log(
                      "Dentro do bloco else if (results[0].dataentrega !== null)"
                    );
                    const prazoentrega = results[0].prazoentrega;
                    const dataOriginal = new Date(prazoentrega);
                    const dia = String(dataOriginal.getDate()).padStart(2, "0");
                    const mes = String(dataOriginal.getMonth() + 1).padStart(
                      2,
                      "0"
                    );
                    const ano = dataOriginal.getFullYear();

                    const diaentr = String(
                      results[0].dataentrega.getUTCDate()
                    ).padStart(2, "0");
                    const mesentr = String(
                      results[0].dataentrega.getUTCMonth() + 1
                    ).padStart(2, "0");
                    const anoentr = results[0].dataentrega.getUTCFullYear();
                    let PrazoEntrega = `${dia}/${mes}/${ano}`;
                    let DataEntrega = `${diaentr}/${mesentr}/${anoentr}`;
                    console.log(PrazoEntrega);
                    console.log(DataEntrega);
                    const finalresp = `*Informações de Rastreio:* \n\nPrazo de Entrega: ${PrazoEntrega}\n\nData da Entrega: ${DataEntrega} `;
                    client.sendText(message.from, finalresp);
                    modulosImportados.enviarMenuPrincipal(
                      client,
                      message,
                      estadoUsuario
                    );

                    connection.release();

                    // Chama a função enviarMenuPrincipal
                    estadoCompartilhado.controleErro = false;
                  } else {
                    const prazoentrega = results[0].prazoentrega;
                    const dataOriginal = new Date(prazoentrega);
                    const dia = String(dataOriginal.getDate()).padStart(2, "0");
                    const mes = String(dataOriginal.getMonth() + 1).padStart(
                      2,
                      "0"
                    );
                    const ano = dataOriginal.getFullYear();
                    let PrazoEntrega = `${dia}/${mes}/${ano}`;
                    const finalrespo = `*Informações de Rastreio:* \n\nPrazo de Entrega: ${PrazoEntrega}\n\n*Sua mercadoria está em rota de Entrega*`;
                    client.sendText(message.from, finalrespo);
                    // Chama a função enviarMenuPrincipal
                    estadoCompartilhado.controleErro = false;
                    modulosImportados.enviarMenuPrincipal(
                      client,
                      message,
                      estadoUsuario
                    );
                    connection.release();
                  }
                }
              }, 5000);
            } else {
              let respostaErro = `*Dados não encontrados para o numero digitado.* \n*Digite 7 para falar com um de nossos Atendentes.*`;
              client.sendText(message.from, respostaErro);
              estadoCompartilhado.controleErro = false;
              modulosImportados.enviarMenuPrincipal(client, message);
              connection.release();
            }
            if (typeof callback === "function") {
              callback(teste);
            }
          }
        );
      }

      testarVendas();
    });
  }
};

module.exports = {
  Numeroum,
};
