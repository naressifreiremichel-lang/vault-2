const fs = require('fs');

async function main() {

  try {

    const apiKey =
      process.env.STEAM_API_KEY;

    const steamId =
      process.env.STEAM_ID;


    /* =========================
       PEGAR LISTA DE AMIGOS
    ========================= */

    const respostaAmigos =
      await fetch(
        `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${apiKey}&steamid=${steamId}&relationship=friend`
      );


    const dadosAmigos =
      await respostaAmigos.json();


    if (!dadosAmigos.friendslist) {

      console.log(
        'Lista de amigos privada ou indisponivel'
      );

      fs.writeFileSync(
        'data/amigos.json',
        '[]'
      );

      return;

    }


    const amigos =
      dadosAmigos.friendslist.friends || [];


    const ids =
      amigos
        .map(a => a.steamid)
        .join(',');


    if (!ids) {

      fs.writeFileSync(
        'data/amigos.json',
        '[]'
      );

      return;

    }


    /* =========================
       PEGAR PERFIS
    ========================= */

    const respostaPerfis =
      await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${ids}`
      );


    const dadosPerfis =
      await respostaPerfis.json();


    const jogadores =
      dadosPerfis.response?.players || [];


    /* =========================
       PEGAR BANNERS
    ========================= */

    const resultado = [];


    for (const jogador of jogadores) {

      let banner = '';


      try {

        const respostaBanner =
          await fetch(
            `https://api.steamcommunity.com/IPlayerService/GetProfileBackground/v1/?key=${apiKey}&steamid=${jogador.steamid}&language=english`
          );


        const dadosBanner =
          await respostaBanner.json();


        banner =
          dadosBanner?.response
            ?.profile_background
            ?.image_large || '';


      } catch (erroBanner) {

        console.log(
          `Nao foi possivel pegar o banner de ${jogador.personaname}`
        );

      }


      /* =========================
         SALVAR AMIGO
      ========================= */

      resultado.push({

        steamid:
          jogador.steamid,

        nome:
          jogador.personaname,

        avatar:
          jogador.avatarfull,

        status:
          jogador.gameextrainfo
            ? `Jogando ${jogador.gameextrainfo}`
            : jogador.personastate > 0
            ? 'Online'
            : 'Offline',

        banner:
          banner

      });


      console.log(
        `Amigo processado: ${jogador.personaname}`
      );

    }


    /* =========================
       SALVAR JSON
    ========================= */

    fs.writeFileSync(
      'data/amigos.json',
      JSON.stringify(
        resultado,
        null,
        2
      )
    );


    console.log(
      'amigos.json gerado com banners'
    );


  } catch (erro) {

    console.error(erro);


    fs.writeFileSync(
      'data/amigos.json',
      '[]'
    );

  }

}


main();
