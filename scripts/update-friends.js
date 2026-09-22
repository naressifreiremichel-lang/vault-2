const fs = require('fs');

async function main() {

  try {

    const apiKey =
      process.env.STEAM_API_KEY;

    const steamId =
      process.env.STEAM_ID;

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

    const respostaPerfis =
      await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${ids}`
      );

    const dadosPerfis =
      await respostaPerfis.json();

    const resultado =
      dadosPerfis.response.players.map(
        jogador => ({

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
              : 'Offline'

        })
      );

    fs.writeFileSync(
      'data/amigos.json',
      JSON.stringify(
        resultado,
        null,
        2
      )
    );

    console.log(
      'amigos.json gerado'
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
