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

// Define message.body como null

let controle2 = false;

const tresum = async (client, message, estadoUsuario, estadoCompartilhado) => {
  if (!estadoCompartilhado) {
    estadoCompartilhado = {
      controleErrotres: true,
    };
  }
  controle2 = true;
  if (controle2 === true && estadoCompartilhado.controleErrotres === true) {
    console.log("Entrou na função tresum");
    console.log("Mensagem recebida:", message.body);
    const Buscar = message.body.replace(/\s/g, "");
    console.log("Texto tratado:", Buscar);
    const aguarde =
      "*Estamos localizando os dados da sua compra.*\n*Aguarde...*";
    client.sendText(message.from, aguarde);

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Erro ao obter conexão do pool:", err);
        // Tratar erro, se necessário
        return;
      }
      function testarVendasEMontar() {
        console.log("Iniciando consulta SQL...");
        connection.query(
          "",

          [`${Buscar}`],

          (error, results, fields) => {
            console.log("Consulta realizada:", Buscar);
            console.log("Resultados:", results);
            if (error) {
              console.error("Erro ao executar a consulta:", error);
              // Tratar erro, se necessário
              connection.release();
              if (typeof callback === "function") {
                callback(false);
              }
              return;
            }
            const pattern = /^vn-[0-9]{8}\/.{2}$/i;
            if (results.length > 0 && pattern.test(Buscar)) {
              console.log("Dados encontrados para:", Buscar);
              console.log("Detalhes do resultado:", results[0]);
              const clientes = results[0].clientevn;
              const empresa = results[0].empresa;
              const numero = results[0].numero;

              const prazoentrega = results[0].data;
              const dataOriginal = new Date(prazoentrega);
              const dia = String(dataOriginal.getDate()).padStart(2, "0");
              const mes = String(dataOriginal.getMonth() + 1).padStart(2, "0");
              const ano = dataOriginal.getFullYear();
              const prazomontagem = results[0].prazomontagem;
              const dataVenda = `${dia}/${mes}/${ano}`;
              console.log("----------------------------");
              console.log("Clientes:", clientes);
              console.log("Empresa:", empresa);
              console.log("Número:", numero);
              console.log("Data da venda:", dataVenda);
              let respostausuario = `*Olá* ${clientes}, \n*Você comprou na loja:* ${empresa}\n*Número:* ${numero}\n*Data da compra:* ${dataVenda}`;
              client.sendText(message.from, respostausuario);

              // Verifica se há dados de montagem
              if (prazomontagem instanceof Date) {
                if (results[0].datamontagem instanceof Date) {
                  const prazoFormatter = new Intl.DateTimeFormat("pt-BR");
                  const PrazoMontagem = prazoFormatter.format(prazomontagem);

                  const dataFormatter = new Intl.DateTimeFormat("pt-BR");
                  const DataMontagem = dataFormatter.format(
                    results[0].datamontagem
                  );

                  const finalresp = `*Informações da Montagem:* \n\nPrazo da Montagem: ${PrazoMontagem}\n\nData da Montagem: ${DataMontagem} `;
                  client.sendText(message.from, finalresp);
                  console.log("-----------------------");
                  console.log("Resposta final:", finalresp);
                  modulosImportados.enviarMenuPrincipal(client, message);
                  connection.release();
                } else {
                  const dia = String(prazomontagem.getDate()).padStart(2, "0");
                  const mes = String(prazomontagem.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const ano = prazomontagem.getFullYear();
                  let PrazoMontagem = `${dia}/${mes}/${ano}`;
                  const finalrespo = `*Informações da Montagem:* \n\nPrazo da Montagem: ${PrazoMontagem}\n\n*Sua mercadoria está em rota de Montagem*`;
                  client.sendText(message.from, finalrespo);
                  console.log("-----------------------");
                  console.log("Resposta final:", finalrespo);
                  modulosImportados.enviarMenuPrincipal(client, message);
                  connection.release();
                }
              } else {
                const res = "Não existe montagem para os seus produtos";
                client.sendText(message.from, res);
                modulosImportados.enviarMenuPrincipal(client, message);
                connection.release();
              }

              if (typeof callback === "function") {
                callback(true);
              }

              if (typeof callback === "function") {
                callback(false);
              }
            } else {
              setTimeout(() => {
                let respostaErro = `*Dados não encontrados para o número digitado.* \n *Favor digite 7 para falar com um de nossos atendentes*`;
                client.sendText(message.from, respostaErro);
                estadoCompartilhado.controleErrotres = false;
                modulosImportados.enviarMenuPrincipal(client, message);
                connection.release();
              }, 7000);
              if (typeof callback === "function") {
                callback(false);
              }
            }
          }
        );
      }
      testarVendasEMontar();
    });
  }
};

module.exports = {
  tresum,
};
