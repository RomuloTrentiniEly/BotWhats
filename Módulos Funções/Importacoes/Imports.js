const mysql = require('mysql2');

const usuariosQueViramMenu = {}


const pool = mysql.createPool({
  host: '',
  user: '',
  password: '',
  database: '',
  connectionLimit: 10,
});

let estadoUsuario = {};

//Envio Menu Principal:
const enviarMenuPrincipal = (client, message,) => {
    resetarEstadoUsuario(estadoUsuario, message);
  
    // Aguarde 5 segundos antes de enviar o menu
    setTimeout(() => {
      if (!estadoUsuario.mensagemInicialEnviada) {
        const resposta = ` Gostaria de realizar outra solicitação? \nEscolha uma opção abaixo:
  
        *1* - 🛒 Compre Agora!
        *2* - 🤳 Rastrear Compra 
        *3* - 🔨 Montagem
        *4* - 🛠 Assistência
        *5* - 📦 Troca/Devolução
        *6* - 💬 Sugestões 
        *7* - Falar Com Atendente
      `;
  
        estadoUsuario.mensagemInicialEnviada = true;
        client.sendText(message.from, resposta);
      } else if (!estadoUsuario.escolhaDepartamento) {
        // ... (código anterior para a escolha do departamento)
      } else {
        // O usuário já escolheu um departamento, então verificamos se a opção é um número de 1 a 6
        const opcaoEscolhida = parseInt(message.body);
        if (opcaoEscolhida >= 1 && opcaoEscolhida <= 6) {
          // Chama a função correspondente à opção escolhida
          switch (opcaoEscolhida) {
            case 1:
              NumeroUm.opcao1(client, message, estadoUsuario);
              break;
            case 2:
              NumeroDois.opcao2(client, message, estadoUsuario);
              break;
            case 3:
              NumeroTres.opcao3(client, message, estadoUsuario);
              break;
            case 4:
              NumeroQuatro.opcao4(client, message, estadoUsuario);
              break;
            case 5:
              NumeroCinco.opcao5(client, message, estadoUsuario);
              break;
            case 6:
              NumeroSeis.opcao6(client, message, estadoUsuario);
              break;
              case 7:
              NumeroSete.opcao7(client, message, estadoUsuario);
              break;
          }
        } else {
          // Mensagem de opção inválida
          const resposta = 'Opção inválida. Por favor, escolha um número de 1 a 6.';
          client.sendText(message.from, resposta);
        }
      }
    }, 7000); // Tempo de espera de 5 segundos
  };
  //------------------------------------------------------------------------------------------------------------//
  
  //Resetando Estado Usuario
  function resetarEstadoUsuario(estadoUsuario) {
    estadoUsuario.mensagemInicialEnviada= false,
    estadoUsuario.escolhaDepartamento= false,
    estadoUsuario.controleum = false;
    estadoUsuario.controledois = false;
    estadoUsuario.controledoisum = false;
    estadoUsuario.controledoisdois = false;
    estadoUsuario.controletres = false;
    estadoUsuario.controletresum = false;
    estadoUsuario.controletresdois = false;
    estadoUsuario.controleQuatro = false;
    estadoUsuario.controleQuatroum = false;
    estadoUsuario.controleQuatrodois = false;
    estadoUsuario.controleCinco = false;
    estadoUsuario.controleSeis = false;
    estadoUsuario.controleSete=false;
    estadoUsuario.MenuSecreto = false;
    estadoUsuario.reserva = false;
  
    
  }

  //-------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------
const mostrarMenu = (client, message) => {
    const remetente = message.from;
    if (message.body != null && message.isGroupMsg === false) {
      if (!usuariosQueViramMenu[remetente]) {
        const mensagem = `Olá, Me chamo ** da * Magazine-BA*.😀
      
    Digite o número para o qual deseja ser direcionado:
    
    *1* - 🛒 Compre Agora! 
    *2* - 🤳 Rastrear Compra 
    *3* - 🔨 Montagem 
    *4* - 🛠 Assistência 
    *5* - 📦 Troca/Devolução
    *6* - 💬 Sugestões 
    *7* - Falar Com Atendente
  
        *Obs: Digite apenas o Número*
      `;
  
        client.sendText(remetente, mensagem);
        usuariosQueViramMenu[remetente] = true;
      }
    }
  };
//------------------------------------------------------------------------------------------------





function verificarMensagensNaoRespondidas(client, estadosUsuarios) {
  console.log('Verificando mensagens não respondidas...');
  console.log('Estados de usuários:', estadosUsuarios);
  Object.keys(estadosUsuarios).forEach((remetente) => {
    console.log('Remetente:', remetente);
    const estadoUsuario = estadosUsuarios[remetente];

      if (!estadoUsuario.mensagemInicialEnviada) {
         const res = mostrarMenu(client, message)
          client.sendText(remetente,res );
          console.log(`Enviando mensagem inicial para o remetente ${remetente}.`);
          estadoUsuario.mensagemInicialEnviada = true;
      }
  });
}
//---------------------------------------------------------------------------------------------------

const secretoMenu = (client, message, estadoUsuario) => {
  const remetente = message.from;
  const numeroSemSufixo = remetente.replace(/@c.us/g, '');

  pool.query(
    '',
    [numeroSemSufixo],
    (error, results, fields) => {
      if (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        return;
      }

      if (results.length > 0) {         
            const mensagem = `*Escolha uma opção do menu?*.🕵️
                
Digite o Código do produto que deseja informações:      
        `;

            client.sendText(message.from, mensagem);
            controle2 = true;
          } else{
            const resp = `Você não possui autorização para utilizar essa Área`
            client.sendText(message.from, resp);
            enviarMenuPrincipal(client, message, estadoUsuario);
          }
        }
      
    
  );
      }

//-----------------------------------------------------------------------------------------------------------

const Verificarreserva = (client, message, estadoUsuario) => {
  const remetente = message.from;
  const numeroSemSufixo = remetente.replace(/@c.us/g, '');

  pool.query(
    '',
    [numeroSemSufixo],
    (error, results, fields) => {
      if (error) {
        console.error('Erro ao consultar o banco de dados:', error);
        return;
      }

      if (results.length > 0) {         
            const mensagem = `Digite o número da vn que deseja informações:🕵️`;

            client.sendText(message.from, mensagem);
            controle2 = true;
          } else{
            const resp = `Você não possui autorização para utilizar essa Área`
            client.sendText(message.from, resp);
            enviarMenuPrincipal(client, message, estadoUsuario);
          }
        } 
  );
      }
      //--------------------------------------------------------------------------------------------------------------
      const tratarNome = (client, message, estadoUsuario, nome) => {
        console.log(nome);
        console.log('nome a cima*******')
        let resposta = `Para melhor atendê-lo(a), precisamos de *mais detalhes sobre a natureza do seu problema*.`;
        let resposta2 = ` *Horario de funcionamento do Sac:*
      Segunda a Sexta: 08:00 às 17:00.
      Sábado: 08:00 às 12:00 `;
        client.sendText(message.from, resposta);
        client.sendText(message.from, resposta2);
        estadoUsuario.solicitandoNome = false;
      };
      //-------------------------------------------------------------------------------------------------------------------------
module.exports = {
  tratarNome,Verificarreserva,secretoMenu,resetarEstadoUsuario,enviarMenuPrincipal,mostrarMenu,verificarMensagensNaoRespondidas: verificarMensagensNaoRespondidas

}