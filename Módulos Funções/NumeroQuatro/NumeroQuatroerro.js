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
let testevendas = false;

const quatrosim = async (
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
  if (controle2 === true && estadoCompartilhado.controleErroquatro === true) {
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

      testarVendas((teste) => {});

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
            " ",
            [Buscar],
            (error, results, fields) => {
              if (error) {
                console.error("Erro ao consultar o banco de dados:", error);
                // Tratar erro, se necessário
                return;
              }
              const pattern = /^vn-[0-9]{8}\/.{2}$/i;
              if (results.length > 0 && pattern.test(Buscar)) {
                const clientes = results[0].cliente;
                var empresa = results[0].empresa;
                var numero = results[0].numero;
                const datavenda = results[0].data;
                const dataOriginal = new Date(datavenda);
                const dia = String(dataOriginal.getDate()).padStart(2, "0");
                const mes = String(dataOriginal.getMonth() + 1).padStart(
                  2,
                  "0"
                );
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

                      dia = String(PrazoSolucao.getUTCDate()).padStart(2, "0");
                      mes = String(PrazoSolucao.getUTCMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      ano = PrazoSolucao.getUTCFullYear();
                      PrazoSolucao = `${dia}/${mes}/${ano}`;
                    } else {
                      PrazoSolucao = null;
                    }

                    if (item.solucionado !== null) {
                      Solucionado = item.solucionado;

                      diaentr = String(Solucionado.getUTCDate()).padStart(
                        2,
                        "0"
                      );
                      mesentr = String(Solucionado.getUTCMonth() + 1).padStart(
                        2,
                        "0"
                      );
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
                        "Identificamos a falta de informações sobre a assistência técnica para a sua compra.\n*Digite 7 para falar com um de nossos atendentes* ";
                      client.sendText(message.from, resposta);
                      connection.release();
                    } else if (PrazoSolucao !== null && Solucionado === null) {
                      const respostaAlternativa = `*Informações da Assistência:* \n\n*${codigo}*: \nPrazo da Solução:  ${PrazoSolucao}\nData da Solução: *Em processo de Assistência*`;
                      client.sendText(message.from, respostaAlternativa);
                      connection.release();
                    } else {
                      const respostaAssistencia = `*Informações da Assistência:* \n\n*${codigo}*: \nPrazo da Solução:  ${PrazoSolucao}\nData da Solução: ${Solucionado}`;
                      client.sendText(message.from, respostaAssistencia);
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
                let respostaErro = `*Dados não encontrados para o numero digitado.* \n*Digite 7 para falar com um de nossos Atendentes.*`;
                client.sendText(message.from, respostaErro);
                modulosImportados.enviarMenuPrincipal(
                  client,
                  message,
                  estadoUsuario
                );
                estadoCompartilhado.controleErroquatro = false;
                connection.release();
              }

              if (typeof callback === "function") {
                callback(teste);
                console.log(teste);
              }
            }
          );
        }
      }
    });
  }
};

module.exports = {
  quatrosim,
};
