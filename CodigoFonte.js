//Importações
const moment = require('moment');
const venom = require('venom-bot');
const modulosImportados = require('./Módulos Funções/Importacoes/Imports');
const NumeroUm = require('./Módulos Funções/NumeroUm/NumeroUm');
const NumeroDois = require('./Módulos Funções/NumeroDois/NumeroDois')
const NumeroDoisErro = require('./Módulos Funções/NumeroDois/NumeroDoisErro')
const NumeroTres = require('./Módulos Funções/NumeroTres/NumeroTres')
const NumeroTreserro = require('./Módulos Funções/NumeroTres/NumeroTreserro')
const NumeroQuatro = require('./Módulos Funções/NumeroQuatro/NumeroQuatro');
const NumeroQuatroErro = require('./Módulos Funções/NumeroQuatro/NumeroQuatroerro');
const NumeroCinco = require('./Módulos Funções/NumeroCinco/NumeroCinco');
const NumeroSeis = require('./Módulos Funções/NumeroSeis/NumeroSeis')
const NumeroSete = require('./Módulos Funções/NumeroSete/NumeroSete')
const VerificarProduto = require('./Módulos Funções/Produto&Reserva/Verificarproduto')
const Reserva = require('./Módulos Funções/Produto&Reserva/Reserva')
const Verificarreserva = require('./Módulos Funções/Produto&Reserva/VerificarReserva')

const estadoCompartilhado = {
  controleErro: false,
  controleErrotres: false,
  controleErroquatro: false 
};

const estadosUsuarios = {};

// Criação do bot usando venom-bot
venom.create({
  session: 'Bot',
  multidevice: true
})
.then((client) => {
  // Função para iniciar o bot quando estiver pronto
  comecar(client);

  // Função para capturar e enviar o QR code para o processo de renderização
  client.onStateChange((state) => {
    if (state === 'CONFLICT' || state === 'UNPAIRED') {
      client.getQrCode().then((qrCode) => {
        ipcRenderer.send('qrcode', qrCode);
      });
    }
  });
})
.catch((error) => {
  console.error('Erro ao iniciar o Venom Bot:', error);
});



// Função de início do bot
const comecar = (client,estadoCompartilhado) => {
  let nome;
  const now = moment();
  const otherTime = moment('17:00', 'HH:mm');
  if (now.isBefore(otherTime)) {
    // Definir um horário específico para comparar
    client.onMessage(async (message) => {
      const remetente = message.from;
      console.log('Mensagem recebida:', message.body);

      if (!estadoCompartilhado) {
        estadoCompartilhado = {
          controleErro: false,
          controleErrotres: false,
          controleErroquatro: false,
        };
      }

      if (!estadosUsuarios[remetente]) {
        estadosUsuarios[remetente] = {
          mensagemInicialEnviada: false,
          escolhaDepartamento: false,
          controleum: false,
          controledois: false,
          controletres: false,
          controleQuatro: false,
          controleCinco: false,
          controleSeis: false,
          controleSete: false,
          menuSecreto: false,
          controlemenu: false,
          controlemenu2: false,
          controlemenu3: false,
          MenuSecreto : false,
          nome : '',
          reserva:false,
          inactivityTimer: null, // Adiciona a propriedade inactivityTimer ao estado do usuário
        };
      }

      const estadoUsuario = estadosUsuarios[remetente];
      if (
        message.type === 'ptt' || 
        (message.isMedia === true && message.type === 'audio') &&
        (message.isGroupMsg === false)
      ) {
        console.log('Áudio recebido. Não processado.');
        let resposta = `*Nosso sistema não permite áudios.*`;
        client.sendText(message.from, resposta)
      } else {
      // Função para verificar se os primeiros bytes indicam um arquivo de áudio
      if (message.body.startsWith('/9j/4AAQSkZJRgABAQAAAQABAAD/')) {
       const res = '*Nosso Sistema não Permite imagens e videos*'
       client.sendText(message.from, res)
        // Adicione aqui a lógica para bloquear ou ignorar a mensagem
    } else {
      
       {
        if (message.body != null && message.isGroupMsg === false) {
          if (!estadoUsuario.mensagemInicialEnviada) {
            modulosImportados.mostrarMenu(client, message);
            estadoUsuario.mensagemInicialEnviada = true;
          } else {
            if (message.body === '1' || message.body === '1-' ) {
              console.log('Selecionada opção 1');
              const resposta1 = `*Qual departamento deseja ser direcionado?*
              
  *A* - Sala de Jantar
  *B* - Sala De Estar
  *C* - Quarto
  *D* - Cozinha
  *E* - Área de Serviço
  *F* - Escritório
  *G* - Falar com Vendedor`;

              client.sendText(message.from, resposta1);
              estadoUsuario.controleum = true;
            } else if (estadoUsuario.controleum) {
              console.log('Processando opção 1');
              NumeroUm.opcao1(client, message, estadoUsuario);
              estadoUsuario.controleum = false;
            } else if (message.body === '2' || message.body === '2-') {
              console.log('Selecionada opção 2');
              const resposta = `*Tenha em Mãos a sua nota de compra*

Você possui a nota de compra?
Digite *S* para Sim.
Digite *N* para Não.`;

              client.sendText(message.from, resposta);
              estadoUsuario.controledois = true;
            } else if (estadoUsuario.controledois && message.body && message.body.length === 1 && ['S'].includes(message.body.toUpperCase())) {
              console.log('Resposta "Sim" para opção 2');
              NumeroDois.Numeroum(client, message, estadoUsuario, estadoCompartilhado);
              estadoUsuario.controledoisum = true;
            } else if (estadoUsuario.controledois && message.body && message.body.length === 1 && ['N'].includes(message.body.toUpperCase())) {
              console.log('Resposta "Não" para opção 2');
              NumeroDois.Numerodoiss(client, message, estadoUsuario);
              estadoUsuario.controledoisdois = true;
            } else if (estadoUsuario.controledoisum && estadoUsuario.controledois === true) {
              console.log('Processando resposta "Sim" para opção 2');
              NumeroDois.Numeroum(client, message, estadoUsuario, estadoCompartilhado);
              estadoUsuario.controledoisum = false;
              estadoUsuario.controledois = false;
            } else if (estadoUsuario.controledoisdois && estadoUsuario.controledois === true) {
              console.log('Processando resposta "Não" para opção 2');
              NumeroDois.Numerodoiss(client, message, estadoUsuario);
              estadoUsuario.controledoisdois = false;
              estadoUsuario.controledois = false;
            } else if (estadoCompartilhado.controleErro === true) { //utilizado caso tenha digitado errado o numero da VN
              console.log('Erro na opção 2');
              NumeroDoisErro.Numeroum(client, message, estadoUsuario, estadoCompartilhado);
            } else if (message.body === "3" || message.body === '3-') {
              console.log('Selecionada opção 3');
              // Definir os botões
              const resposta = `*Tenha em Mãos a sua nota de compra*

Você possui a nota de compra?
Digite *S* para Sim.
Digite *N* para Não.`;

              client.sendText(message.from, resposta);
              estadoUsuario.controletres = true;
            } else if (estadoUsuario.controletres && message.body && message.body.length === 1 && ['S'].includes(message.body.toUpperCase())) {
              console.log('Resposta "Sim" para opção 3');
              NumeroTres.tresum(client, message, estadoUsuario, estadoCompartilhado);
              estadoUsuario.controletresum = true;
            } else if (estadoUsuario.controletres && message.body && message.body.length === 1 && ['N'].includes(message.body.toUpperCase())) {
              console.log('Resposta "Não" para opção 3');
              NumeroTres.tresnao(client, message, estadoUsuario);
              estadoUsuario.controletresdois = true;
            } else if (estadoUsuario.controletresum && estadoUsuario.controletres === true) {
              console.log('Processando resposta "Sim" para opção 3');
              NumeroTres.tresum(client, message, estadoUsuario, estadoCompartilhado);
              estadoUsuario.controletresum = false;
              estadoUsuario.controletres = false;
            } else if (estadoUsuario.controletresdois && estadoUsuario.controletres === true) {
              console.log('Processando resposta "Não" para opção 3');
              NumeroTres.tresnao(client, message, estadoUsuario);
              estadoUsuario.controletresdois = false;
              estadoUsuario.controletres = false;
            } else if (estadoCompartilhado.controleErrotres === true) { //utilizado caso tenha digitado errado o numero da VN
              console.log('Erro na opção 3');
              NumeroTreserro.tresum(client, message, estadoUsuario, estadoCompartilhado);
            } else if (message.body === "4" || message.body === '4-') {
              console.log('Selecionada opção 4');
              const resposta = `*Tenha em Mãos a sua nota de compra*

Você possui a nota de compra?
Digite *S* para Sim.
Digite *N* para Não.`;

              client.sendText(message.from, resposta);
              estadoUsuario.controleQuatro = true;
            } else if (estadoUsuario.controleQuatro && ['S'].includes(message.body.toUpperCase())) {
              console.log('Resposta "Sim" para opção 4');
              NumeroQuatro.quatrosim(client, message, estadoUsuario, estadoCompartilhado);
              estadoUsuario.controleQuatroum = true;
            } else if (estadoUsuario.controleQuatro && message.body && message.body.length === 1 && ['N'].includes(message.body.toUpperCase())) {
              console.log('Resposta "Não" para opção 4');
              NumeroQuatro.quatronao(client, message, estadoUsuario);
              estadoUsuario.controleQuatrodois === true;
            } else if (estadoUsuario.controleQuatroum && estadoUsuario.controleQuatro === true) {
              console.log('Processando resposta "Sim" para opção 4');
              NumeroQuatro.quatrosim(client, message, estadoUsuario, estadoCompartilhado);
              estadoUsuario.controleQuatroum = false;
              estadoUsuario.controleQuatro = false;
            } else if (estadoUsuario.controleQuatrodois && estadoUsuario.controleQuatro === true) {
              console.log('Processando resposta "Não" para opção 4');
              NumeroQuatro.quatronao(client, message, estadoUsuario);
              estadoUsuario.controleQuatrodois = false;
              estadoUsuario.controleQuatro = false;
            } else if (estadoCompartilhado.controleErroquatro === true) { //utilizado caso tenha digitado errado o numero da VN
              console.log('Erro na opção 4');
              NumeroQuatroErro.quatrosim(client, message, estadoUsuario, estadoCompartilhado);
            } else if (message.body === "5" || message.body === '5-') {
              console.log('Selecionada opção 5');
              let resposta = `*Digite seu nome Completo*`;
              estadoUsuario.controleCinco = true;

              client.sendText(message.from, resposta);
            } else if (estadoUsuario.controleCinco) {
              console.log('Processando opção 5');
              estadoUsuario.controleCinco = false;
              NumeroCinco.opcao5(client, message, estadoUsuario);
            } else if (message.body === "6" || message.body === '6-') {
              console.log('Selecionada opção 6');
              let resposta = `*Digite a sua Sugestão*
`;
              estadoUsuario.controleSeis = true;
              client.sendText(message.from, resposta);
            } else if (estadoUsuario.controleSeis) {
              console.log('Processando opção 6');
              estadoUsuario.controleSeis = false;
              NumeroSeis.opcao6(client, message, estadoUsuario);
            
            } else if (message.body === "7" || message.body === '7-') {
              console.log('Selecionada opção 7');
               let respostaNome = `Olá! Antes de prosseguir, poderia me informar seu nome?`;
                client.sendText(message.from, respostaNome);
                estadoUsuario.solicitandoNome = true;
                estadoUsuario.controleSete = true;

              setTimeout(() => {
                  if (estadoUsuario.controleSete) {
                      let respostaTimeout = `Devido à falta de interação, se desejar falar com um de nossos atendentes, digite 7 novamente`;
                      modulosImportados.enviarMenuPrincipal(client, message, estadoUsuario);
                      client.sendText(message.from, respostaTimeout);
                      estadoUsuario.controleSete = false; 
                  }
                }, 600000);
              }else if (estadoUsuario.solicitandoNome && estadoUsuario.controleSete === true) {
                  // Nome já solicitado, processando
                   nome = message.body;
                  modulosImportados.tratarNome(client, message, estadoUsuario, nome);
                } else if (estadoUsuario.controleSete) {
                  // Opção 7 sendo processada
                  console.log('Processando opção 7');
                  estadoUsuario.controleSete = false;
                  // Verifique se 'nome' está definido antes de chamar a função
                  NumeroSete.opcao7(client, message, estadoUsuario, nome); 
                
              }else if (message.body === "Verificarproduto" && !estadoUsuario.menuSecreto) {
                estadoUsuario.MenuSecreto = true;
                modulosImportados.secretoMenu(client, message, estadoUsuario);
            } else if (estadoUsuario.MenuSecreto === true) {
                estadoUsuario.MenuSecreto = false;
                VerificarProduto.secretoMenu(client, message, estadoUsuario);
      
              } else if (message.body === "Verificarreserva" && !estadoUsuario.reserva) {
                estadoUsuario.reserva = true;
                Reserva.Verificarreserva(client, message, estadoUsuario);
            } else if (estadoUsuario.reserva === true) {
                estadoUsuario.reserva = false;
             } else {
                
             
                // Opção inválida
                console.log('Opção inválida');
                const resposta = `Por favor, escolha uma opção válida.`;
                client.sendText(message.from, resposta);
              }
            }
          }
        }
      }
    }
    }
    );
  }
};


module.exports = {
  comecar, 
  estadoCompartilhado,
  estadosUsuarios
};
