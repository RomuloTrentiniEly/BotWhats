const modulosImportados = require("../Importacoes/Imports");
const opcao6 = async (client, message, estadoUsuario) => {
  let controleSeis = false;

  if (message.body) {
    controleSeis = true;
    console.log("Mensagem do Usuário:", message.body);
    let Sugestao = message.body;
    const numeroSemSufixo = message.from.replace(/@c.us/g, "");
    console.log("Número do Cliente:", numeroSemSufixo);

    const resposta5 = `*Muito Obrigado pela sua sugestão, com base nisso iremos melhorar para um melhor desempenho da nossa empresa!*`;
    client.sendText(message.from, resposta5);
    // Número de celular do vendedor
    const numeroVendedor = "";

    // Mensagem a ser enviada para o vendedor
    const mensagemParaVendedor = `Sugestão do Cliente: ${Sugestao}`; // Adicionando a sugestão na mensagem

    // Enviar mensagem para o vendedor
    client.sendText(
      `${numeroVendedor}@c.us`,
      `${mensagemParaVendedor}\n\nNúmero do Cliente: ${numeroSemSufixo}`
    );

    modulosImportados.enviarMenuPrincipal(client, message, estadoUsuario);
  }
};

module.exports = {
  opcao6,
};
