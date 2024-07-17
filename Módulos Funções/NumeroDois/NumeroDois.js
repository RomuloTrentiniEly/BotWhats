const mysql = require("mysql2");
const modulosImportados = require("../Importacoes/Imports");
const protocoloAtendimento = require("../Importacoes/ProtocoloAtend");
// Configurações de conexão com o banco de dados
const pool = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  connectionLimit: 50, // Número máximo de conexões simultâneas
});
let controle = false;
let controle2 = false;
//Function Princpal
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

  if (
    message.body.toLowerCase() === "s" &&
    estadoUsuario.controledois === true
  ) {
    const resposta = `Digite o número da sua nota de venda:
  *Obs*: Se encontra no canto superior da Nota.
        Exemplo: *VN-xxxxxx/xx*`;

    client.sendText(message.from, resposta);
    controle2 = true;
  } else if (controle2 === true && estadoUsuario.controledois === true) {
    const Buscar = message.body.replace(/\s/g, "");
    console.log(Buscar);
    let aguarde = "*Estamos localizando os dados da sua compra.*\n*Aguarde...*";
    client.sendText(message.from, aguarde);

    pool.getConnection((err, connection) => {
      try {
        if (err) {
          throw err;
        }

        function testarVendas() {
          connection.query(
            "",
            [`%${Buscar}%`],
            (error, results, fields) => {
              try {
                if (error) {
                  throw error;
                }

                const pattern = /^vn-[0-9]{8}\/.{2}$/i;
                if (results.length > 0 && pattern.test(Buscar)) {
                  const clientes = results[0].cliente;
                  const empresa = results[0].empresa;
                  const numero = results[0].numero;
                  const dataCompra = results[0].data;
                  const dataOriginal = new Date(dataCompra);
                  const dia = String(dataOriginal.getDate()).padStart(2, "0");
                  const mes = String(dataOriginal.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
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
                      modulosImportados.enviarMenuPrincipal(
                        client,
                        message,
                        estadoUsuario
                      );
                    } else {
                      if (
                        results.length > 0 &&
                        results[0].dataentrega != null
                      ) {
                        console.log("Dentro do bloco if (results.length > 0)");

                        console.log(
                          "Dentro do bloco else if (results[0].dataentrega !== null)"
                        );
                        const prazoentrega = results[0].prazoentrega;
                        const dataOriginal = new Date(prazoentrega);
                        const dia = String(dataOriginal.getDate()).padStart(
                          2,
                          "0"
                        );
                        const mes = String(
                          dataOriginal.getMonth() + 1
                        ).padStart(2, "0");
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

                        estadoCompartilhado.controleErro = false;
                        modulosImportados.enviarMenuPrincipal(
                          client,
                          message,
                          estadoUsuario
                        );
                        connection.release();
                      } else {
                        const prazoentrega = results[0].prazoentrega;
                        const dataOriginal = new Date(prazoentrega);
                        const dia = String(dataOriginal.getDate()).padStart(
                          2,
                          "0"
                        );
                        const mes = String(
                          dataOriginal.getMonth() + 1
                        ).padStart(2, "0");
                        const ano = dataOriginal.getFullYear();
                        let PrazoEntrega = `${dia}/${mes}/${ano}`;
                        const finalrespo = `*Informações de Rastreio:* \n\nPrazo de Entrega: ${PrazoEntrega}\n\n*Sua mercadoria está em rota de Entrega*`;
                        client.sendText(message.from, finalrespo);

                        estadoCompartilhado.controleErro = false;
                        connection.release();
                        modulosImportados.enviarMenuPrincipal(
                          client,
                          message,
                          estadoUsuario
                        );
                      }
                    }
                  }, 5000);
                } else {
                  let respostaErro = `*Dados não encontrados para o numero digitado.* \n*Favor digite novamente.*\n*Se atente em escrever da seguinte maneira: VN-xxxxxxxx/xx*`;
                  client.sendText(message.from, respostaErro);
                  estadoCompartilhado.controleErro = true;
                  connection.release();
                }
              } catch (error) {
                console.error(
                  "Erro ao processar resultados da consulta:",
                  error
                );
                client.sendText(
                  message.from,
                  "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde."
                );
              }
            }
          );
        }
        testarVendas();
      } catch (error) {
        console.error("Erro ao obter conexão do pool:", error);
        client.sendText(
          message.from,
          "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde."
        );
      }
    });
  }
};
const Numerodoiss = async (client, message, estadoUsuario) => {
  if (message.body.toLowerCase() === "n") {
    const resposta = "Digite o nome completo do titular da compra.";
    estadoUsuario.opcao2 = { controle };
    client.sendText(message.from, resposta);
    console.log("Mensagem do Usuário:", message.body);
    console.log("Controle:", controle);
  } else if (!controle) {
    try {
      const nomeCompleto = message.body; // Captura o nome completo da mensagem
      const numeroSemSufixo = message.from.replace(/@c.us/g, "");
      const numeroFormatado =
        protocoloAtendimento.formatarNumeroTelefone(numeroSemSufixo);
      const numeroProtocolo =
        protocoloAtendimento.gerarNumeroProtocolo(numeroSemSufixo);

      const results = await protocoloAtendimento.buscarProtocolo(
        numeroProtocolo
      );

      if (!results.length) {
        console.log("Mensagem do Usuário:", message.body);
        console.log("Nome Completo:", nomeCompleto); // Mostra o nome completo capturado
        console.log("Número do Cliente:", numeroSemSufixo);

        // Modificação para inserir o atendimento com os dados corretos
        const numeroProtocoloGerado =
          await protocoloAtendimento.inserirAtendimento(
            numeroFormatado,
            nomeCompleto,
            numeroProtocolo
          );

        setTimeout(() => {
          protocoloAtendimento.processarDepoisDeIntervalo(
            client,
            message,
            estadoUsuario,
            nomeCompleto,
            numeroSemSufixo,
            numeroFormatado,
            numeroProtocolo,
            numeroProtocoloGerado
          );
        }, 15000);
      } else {
        const resposta = `*Você já possui um chamado em aberto*`;
        client.sendText(message.from, resposta);
        modulosImportados.enviarMenuPrincipal(client, message, estadoUsuario);
      }
    } catch (error) {
      console.error("Erro ao executar a função opcao7:", error);
      client.sendText(
        message.from,
        "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde."
      );
    }
  }
};

module.exports = {
  Numeroum,
  Numerodoiss,
};
