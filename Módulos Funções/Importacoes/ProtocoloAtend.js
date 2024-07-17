const mysql = require("mysql2");
const modulosImportados = require("../Importacoes/Imports");

const pool = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  connectionLimit: 50, // Número máximo de conexões simultâneas
});

async function consultarNumeros(protocoloAT) {
  try {
    // Obtém uma conexão do pool
    const connection = await pool.promise().getConnection();

    // Consulta SQL para selecionar os valores da coluna 'numero'
    const sql = "";
    const [rows, fields] = await connection.execute(sql, [protocoloAT]);

    // Libera a conexão de volta ao pool
    connection.release();

    console.log("PROTOCOLO QUE DESEJO EXIBIR É ESSE AQUI:", rows);

    // Retorna os resultados da consulta
    return rows;
  } catch (error) {
    console.error("Erro ao consultar números:", error);
    throw error;
  }
}

async function processarDepoisDeIntervalo(
  client,
  message,
  estadoUsuario,
  resumo,
  numeroSemSufixo,
  numeroFormatado,
  numeroProtocolo,
  numeroProtocoloGerado
) {
  try {
    const numerosConsultados = await consultarNumeros(numeroProtocoloGerado);
    const numeros = numerosConsultados.map((objeto) => objeto.numero);
    const protocolo = `O seu número de protocolo para atendimento é: *${numeros.join(
      ", "
    )}*`;

    client.sendText(message.from, protocolo);

    const resposta5 = `*Agradecemos pela sua colaboração. Em breve, um de nossos atendentes entrará em contato para fornecer o atendimento necessário.*`;
    client.sendText(message.from, resposta5);

    const numeroVendedorPedro = "";
    const mensagemParaVendedor = `*Resumo do problema do cliente:* ${resumo}\n*Número de protocolo:* *${numeros.join(
      ", "
    )}*\n*Número do cliente:* ${numeroFormatado} (Clique para iniciar conversa)`;

    client.sendText(`${numeroVendedorPedro}@c.us`, mensagemParaVendedor);

    modulosImportados.enviarMenuPrincipal(client, message, estadoUsuario);
  } catch (error) {
    console.error("Erro ao processar após intervalo de tempo:", error);
    client.sendText(
      message.from,
      "Desculpe, ocorreu um erro ao processar sua solicitação após um intervalo de tempo."
    );
  }
}
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Formatar numeros

const formatarNumeroTelefone = (numero) => {
  // Remove todos os caracteres não numéricos
  let numerosApenas = numero.replace(/\D/g, "");

  // Remove o código do país, se presente
  if (numerosApenas.startsWith("55")) {
    numerosApenas = numerosApenas.substring(2);
  }

  // Verifica se há pelo menos 9 dígitos para o número de telefone (sem o DDD)
  if (numerosApenas.length >= 9) {
    // Formata o número de telefone
    const ddd = numerosApenas.slice(0, 2);
    const parteCentral = numerosApenas.slice(2, -4);
    const parteFinal = numerosApenas.slice(-4);
    return `(${ddd}) ${
      parteCentral.startsWith("9") ? "" : "9"
    }${parteCentral}-${parteFinal}`;
  } else {
    // Retorna o número original se não houver pelo menos 9 dígitos
    return numero;
  }
};
//--------------------------------------------------------------------------------------------------------------------------------------------------------

//GerarNumeroprotocolo
function gerarNumeroProtocolo(numeroTelefone) {
  const ultimosQuatroDigitos = numeroTelefone.slice(-4);
  const dataAtual = new Date();
  const ano = dataAtual.getFullYear().toString().slice(-2);
  const mes = (dataAtual.getMonth() + 1).toString().padStart(2, "0");
  const dia = dataAtual.getDate().toString().padStart(2, "0");
  return `${ano}${mes}${dia}${ultimosQuatroDigitos}`;
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
async function inserirAtendimento(telefone, nome, numeroProtocolo) {
  try {
    // Obtém uma conexão do pool
    const connection = await pool.promise().getConnection();

    // Adicionando a descrição ao resumo
    const resumo = "Montagem/Assistência/Rastrear Pedido";

    // Assunto definido como "FALAR COM ATENDENTE"
    const assunto = "FALAR COM ATENDENTE";

    // Query SQL para inserir dados na tabela
    const sql =
      '';
    const values = [
      new Date(),
      telefone,
      resumo,
      numeroProtocolo,
      assunto,
      nome,
    ];

    // Executa a query de inserção
    const [result] = await connection.execute(sql, values);

    // Libera a conexão de volta ao pool
    connection.release();

    console.log("Dados inseridos com sucesso!");

    // Retorna o número de protocolo gerado
    return numeroProtocolo;
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
    throw error;
  }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
async function inserirAtendimentoSete(telefone, nome, resumo, numeroProtocolo) {
  try {
    // Obtém uma conexão do pool
    const connection = await pool.promise().getConnection();
    console.log(`inserir esse nome aqui:${nome} `);
    // Query SQL para inserir dados na tabela
    const sql =
      '';
    const values = [new Date(), telefone, nome, resumo, numeroProtocolo];

    // Executa a query de inserção
    const [result] = await connection.execute(sql, values);

    // Libera a conexão de volta ao pool
    connection.release();

    console.log("Dados inseridos com sucesso!");

    // Retorna o número de protocolo gerado
    return numeroProtocolo;
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
    throw error;
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function buscarProtocolo(numeroProtocolo) {
  return new Promise((resolve, reject) => {
    pool.query(
      "",
      [numeroProtocolo],
      (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

//---------------------------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------

module.exports = {
  inserirAtendimentoSete,
  buscarProtocolo,
  consultarNumeros,
  formatarNumeroTelefone,
  processarDepoisDeIntervalo,
  gerarNumeroProtocolo,
  inserirAtendimento,
};
