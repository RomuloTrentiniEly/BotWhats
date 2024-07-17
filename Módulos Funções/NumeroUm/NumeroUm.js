let estadoUsuario = {};
let timeoutId;
const importacao = require("../Importacoes/Imports");
// Armazena o ID do timeout no estado do usuário
estadoUsuario.timeoutId = timeoutId;

const opcao1 = (client, message, escolhaDepartamento, estadoUsuario) => {
  if (escolhaDepartamento) {
    if (message.body.toLowerCase() === "a") {
      const resposta =
        "Aqui está o [link para Sala de Jantar]";
      client.sendText(message.from, resposta);
      importacao.enviarMenuPrincipal(client, message, estadoUsuario);
    } else if (message.body.toLowerCase() === "b") {
      const resposta =
        "Aqui está o [link para Sala de Estar]";
      client.sendText(message.from, resposta);
      importacao.enviarMenuPrincipal(client, message, estadoUsuario);
    } else if (message.body.toLowerCase() === "c") {
      const resposta =
        "Aqui está o [link para Quarto]";
      client.sendText(message.from, resposta);
      importacao.enviarMenuPrincipal(client, message, estadoUsuario);
    } else if (message.body.toLowerCase() === "d") {
      const resposta =
        "Aqui está o [link para Cozinha]";

      client.sendText(message.from, resposta);
      importacao.enviarMenuPrincipal(client, message, estadoUsuario);
    } else if (message.body.toLowerCase() === "e") {
      const resposta =
        "Aqui está o [link para Área de Serviço]";

      client.sendText(message.from, resposta);

      importacao.enviarMenuPrincipal(client, message, estadoUsuario);
    } else if (message.body.toLowerCase() === "f") {
      const resposta =
        "Aqui está o [link para Escritório]";
      client.sendText(message.from, resposta);

      importacao.enviarMenuPrincipal(client, message, estadoUsuario);
    } else if (message.body.toLowerCase() === "g") {
      const numeroSemSufixo = message.from.replace(/@c.us/g, ""); // Corrigindo a obtenção do número do cliente

      const resposta5 = `*Breve um de nossos vendedores entrará em contato para auxiliar.*`;
      client.sendText(message.from, resposta5);
      // Número de celular do vendedor Pedro
      const numeroVendedorPedro = "";

      // Mensagem a ser enviada para o vendedor Pedro
      const mensagemParaVendedor = `Cliente precisa de auxilio para realizar compra`; // Adicionando a sugestão na mensagem

      // Enviar mensagem para o vendedor Pedro
      client.sendText(
        `${numeroVendedorPedro}@c.us`,
        `${mensagemParaVendedor}\n\nNúmero do Cliente: ${numeroSemSufixo}`
      );
      importacao.enviarMenuPrincipal(client, message, estadoUsuario);
    }
  }
};

module.exports = {
  opcao1,
};
