const mysql = require('mysql2');
const modulosImportados = require('../Importacoes/Imports');

// Configurações de conexão com o banco de dados
const pool = mysql.createPool({
  host: '',
  user: '',
  password: '',
  database: '',
  connectionLimit: 50, // Número máximo de conexões simultâneas
});

// Define message.body como null


let controle2 = false;
let controle = false;

  const tresum = async (client, message, estadoUsuario, estadoCompartilhado) => {
    try {
      if (!estadoCompartilhado) {
        estadoCompartilhado = {
          controleErrotres: true,
        };
      }
  
      if (message.body.toLowerCase() === "s" && estadoUsuario.controletres === true) {
        const resposta = `Digite o número da sua nota de venda:
        *Obs*: Se encontra no canto superior da Nota.
              Exemplo: *VN-xxxxxx/xx*`;
        client.sendText(message.from, resposta);
        controle2 = true;
      } else if (controle2 === true && estadoUsuario.controletres === true) {
        console.log('Entrou na função tresum');
        console.log('Mensagem recebida:', message.body);
        const Buscar = message.body.replace(/\s/g, "");
        console.log('Texto tratado:', Buscar);
        const aguarde = '*Estamos localizando os dados da sua compra.*\n*Aguarde...*';
        client.sendText(message.from, aguarde);
  
        pool.getConnection((err, connection) => {
          try {
            if (err) {
              throw err;
            }
  
            function testarVendasEMontar() {
              console.log('Iniciando consulta SQL...');
              connection.query(
                '',
  
                [`${Buscar}`],
  
                (error, results, fields) => {
                  try {
                    console.log('Consulta realizada:', Buscar);
                    console.log('Resultados:', results);
                    if (error) {
                      throw error;
                    }
  
                    const pattern = /^vn-[0-9]{8}\/.{2}$/i;
                    if (results.length > 0 && pattern.test(Buscar)) {
                      console.log('Dados encontrados para:', Buscar);
                      console.log('Detalhes do resultado:', results[0]);
                      const clientes = results[0].clientevn;
                      const empresa = results[0].empresa;
                      const numero = results[0].numero;
  
                      const prazoentrega = results[0].data;
                      const dataOriginal = new Date(prazoentrega);
                      const dia = String(dataOriginal.getDate()).padStart(2, '0');
                      const mes = String(dataOriginal.getMonth() + 1).padStart(2, '0');
                      const ano = dataOriginal.getFullYear();
                      const prazomontagem = results[0].prazomontagem;
                      const dataVenda = `${dia}/${mes}/${ano}`;
  
                      console.log('----------------------------');
                      console.log('Clientes:', clientes);
                      console.log('Empresa:', empresa);
                      console.log('Número:', numero);
                      console.log('Data da venda:', dataVenda);
                      let respostausuario = `*Olá* ${clientes}, \n*Você comprou na loja:* ${empresa}\n*Número:* ${numero}\n*Data da compra:* ${dataVenda}`
                      client.sendText(message.from, respostausuario);
  
                      // Verifica se há dados de montagem
                      if (prazomontagem instanceof Date) {
                        if (results[0].datamontagem instanceof Date) {
                          const prazoFormatter = new Intl.DateTimeFormat('pt-BR');
                          const PrazoMontagem = prazoFormatter.format(prazomontagem);
  
                          const dataFormatter = new Intl.DateTimeFormat('pt-BR');
                          const DataMontagem = dataFormatter.format(results[0].datamontagem);
  
                          const finalresp = `*Informações da Montagem:* \n\nPrazo da Montagem: ${PrazoMontagem}\n\nData da Montagem: ${DataMontagem} `;
                          client.sendText(message.from, finalresp);
                          console.log('-----------------------');
                          console.log('Resposta final:', finalresp);
                          modulosImportados.enviarMenuPrincipal(client, message);
                        } else {
                          const dia = String(prazomontagem.getDate()).padStart(2, '0');
                          const mes = String(prazomontagem.getMonth() + 1).padStart(2, '0');
                          const ano = prazomontagem.getFullYear();
                          let PrazoMontagem = `${dia}/${mes}/${ano}`;
                          const finalrespo = `*Informações da Montagem:* \n\nPrazo da Montagem: ${PrazoMontagem}\n\n*Sua mercadoria está em rota de Montagem*`;
                          client.sendText(message.from, finalrespo);
                          console.log('-----------------------');
                          console.log('Resposta final:', finalrespo);
                          modulosImportados.enviarMenuPrincipal(client, message);
                        }
                      } else {
                        const res = 'Não existe montagem para os seus produtos';
                        client.sendText(message.from, res);
                        modulosImportados.enviarMenuPrincipal(client, message);
                      }
                    } else {
                      setTimeout(() => {
                        let respostaErro = `*Dados não encontrados para o número digitado.* \n *Favor digite novamente.*\n   *Se atente em escrever da seguinte maneira: VN-xxxxxxxx/xx*`
                        client.sendText(message.from, respostaErro);
                        estadoCompartilhado.controleErrotres = true;
                      }, 2000)
                    }
                  } catch (err) {
                    console.error('Erro ao processar os resultados da consulta:', err);
                  } finally {
                    connection.release();
                  }
                }
              );
            }
            testarVendasEMontar();
          } catch (err) {
            console.error('Erro durante a consulta SQL:', err);
          }
        });
      }
    } catch (err) {
      console.error('Erro na função tresum:', err);
    }
  };
  
  
const tresnao = async (client, message, estadoUsuario,) => {
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
  tresnao, tresum
};
