const mysql = require("mysql2");
const modulosImportados = require("../Importacoes/Imports");

const pool = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  connectionLimit: 50, // Número máximo de conexões simultâneas
});

let mensagemUsuario = "";
let controle2 = false;
let controle = false;
let testevendas = false;

  const quatrosim = async (
    client,
    message,
    estadoUsuario,
    estadoCompartilhado
  ) => {
    try {
      if (!estadoCompartilhado) {
        estadoCompartilhado = {
          controleErroquatro: false,
        };
      }

      if (
        message.body.toLowerCase() === "s" &&
        estadoUsuario.controleQuatro === true
      ) {
        const resposta = `Digite o número da sua nota de venda:
          *Obs*: Se encontra no canto superior da Nota.
                Exemplo: *VN-xxxxxx/xx*`;
        client.sendText(message.from, resposta);
        controle2 = true;
      } else if (controle2 === true && estadoUsuario.controleQuatro === true) {
        const Buscar = message.body.replace(/\s/g, "");
        let aguarde =
          "*Estamos localizando os dados da sua compra.*\n*Aguarde...*";
        client.sendText(message.from, aguarde);

        pool.getConnection((err, connection) => {
          try {
            if (err) {
              throw err;
            }

            function testarVendas(callback) {
              let dia = "";
              let mes = "";
              let ano = "";
              let diaentr = "";
              let mesentr = "";
              let anoentr = "";
              let PrazoSolucao = "";
              let Solucionado = "";

              if (!testevendas) {
                let teste = true;
                let controleMsg = false;

                connection.query(
                  "",
                  [Buscar],
                  (error, results, fields) => {
                    try {
                      if (error) {
                        throw error;
                      }

                      const pattern = /^vn-[0-9]{8}\/.{2}$/i;
                      if (results.length > 0 && pattern.test(Buscar)) {
                        const clientes = results[0].cliente;
                        var empresa = results[0].empresa;
                        var numero = results[0].numero;
                        const datavenda = results[0].data;
                        const dataOriginal = new Date(datavenda);
                        const dia = String(dataOriginal.getDate()).padStart(
                          2,
                          "0"
                        );
                        const mes = String(
                          dataOriginal.getMonth() + 1
                        ).padStart(2, "0");
                        const ano = dataOriginal.getFullYear();
                        const dataVenda = `${dia}/${mes}/${ano}`;

                        let respostausuario = `*Olá* ${clientes}, \n*Você comprou na loja:* ${empresa}\n*Número:* ${numero}\n*Data da compra:* ${dataVenda}`;
                        client.sendText(message.from, respostausuario);
                        controleMsg = true;
                        console.log(controleMsg);
                        console.log("funçãoExibirNome");
                      }
                      if (controleMsg) {
                        let codigo;
                        if (Array.isArray(results) && results.length > 0) {
                          let respostausuarioItens =
                            "*Aqui estão os itens da sua nota:*\n\n";

                          results.forEach((item, index) => {
                            codigo = item.codigo;
                            let descricao = item.descricao;
                            respostausuarioItens += `*${codigo}* - ${descricao}\n\n`;

                            if (item.prazosolucao !== null) {
                              PrazoSolucao = item.prazosolucao;

                              dia = String(PrazoSolucao.getUTCDate()).padStart(
                                2,
                                "0"
                              );
                              mes = String(
                                PrazoSolucao.getUTCMonth() + 1
                              ).padStart(2, "0");
                              ano = PrazoSolucao.getUTCFullYear();
                              PrazoSolucao = `${dia}/${mes}/${ano}`;
                            } else {
                              PrazoSolucao = null;
                            }

                            if (item.solucionado !== null) {
                              Solucionado = item.solucionado;

                              diaentr = String(
                                Solucionado.getUTCDate()
                              ).padStart(2, "0");
                              mesentr = String(
                                Solucionado.getUTCMonth() + 1
                              ).padStart(2, "0");
                              anoentr = Solucionado.getUTCFullYear();
                              Solucionado = `${diaentr}/${mesentr}/${anoentr}`;
                            } else {
                              Solucionado = null;
                            }

                            console.log(Solucionado);
                            console.log(PrazoSolucao);
                          });
                          setTimeout(() => {
                            client.sendText(message.from, respostausuarioItens);
                          }, 4000);

                          setTimeout(() => {
                            if (PrazoSolucao === null && Solucionado === null) {
                              const resposta =
                                "Identificamos a falta de informações sobre a assistência técnica para a sua compra.\n *Em Breve um de nossos colaboradores entrará em contato.* ";
                              client.sendText(message.from, resposta);

                              let contactName = message.body;
                              const numeroCliente = message.from;
                              const numeroSemSufixo = numeroCliente.replace(
                                /@c.us/g,
                                ""
                              );
                              console.log(
                                "Número do Cliente:",
                                numeroSemSufixo
                              );
                              console.log("Nome do Cliente:", contactName);
                              const numeroVendedorPedro = "";
                              const mensagemParaVendedor = `Novo cliente:\nNome: ${contactName}\nNúmero: ${numeroSemSufixo}`;
                              client.sendText(
                                `${numeroVendedorPedro}@c.us`,
                                mensagemParaVendedor
                              );

                              estadoCompartilhado.controleErroquatro = false;
                              modulosImportados.enviarMenuPrincipal(
                                client,
                                message,
                                estadoUsuario
                              );
                            } else if (
                              PrazoSolucao !== null &&
                              Solucionado === null
                            ) {
                              const respostaAlternativa = `*Informações da Assistência:* \n\n*${codigo}*: \nPrazo da Solução:  ${PrazoSolucao}\nData da Solução: *Em processo de Assistência*`;
                              client.sendText(
                                message.from,
                                respostaAlternativa
                              );
                              connection.release();
                            } else {
                              const respostaAssistencia = `*Informações da Assistência:* \n\n*${codigo}*: \nPrazo da Solução:  ${PrazoSolucao}\nData da Solução: ${Solucionado}`;
                              client.sendText(
                                message.from,
                                respostaAssistencia
                              );
                              connection.release();
                            }
                          }, 5000);
                          estadoCompartilhado.controleErroquatro = false;
                          modulosImportados.enviarMenuPrincipal(
                            client,
                            message,
                            estadoUsuario
                          );
                          liberarMessageDois = true;
                          console.log(liberarMessageDois);
                        }
                        console.log(mensagemUsuario);
                      } else {
                        let respostaErro = `*Dados não encontrados para o numero digitado.* \n *Favor digite novamente.*\n   *Se atente em escrever da seguinte maneira: VN-xxxxxxxx/xx*`;
                        client.sendText(message.from, respostaErro);
                        estadoCompartilhado.controleErroquatro = true;
                        connection.release();
                      }

                      if (typeof callback === "function") {
                        callback(teste);
                        console.log(teste);
                      }
                    } catch (err) {
                      console.error(
                        "Erro durante o processamento dos resultados:",
                        err
                      );
                    }
                  }
                );
              }
            }

            testarVendas();
          } catch (err) {
            console.error("Erro na função de consulta SQL:", err);
          }
        });
      }
    } catch (err) {
      console.error("Erro na função quatrosim:", err);
    }
  };

const quatronao = async (client, message, estadoUsuario) => {
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
  quatrosim,
  quatronao,
};
