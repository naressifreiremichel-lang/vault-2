const fs = require('fs');

async function main() {

  const apiKey =
    process.env.STEAM_API_KEY;

  const amigos =
    JSON.parse(
      fs.readFileSync(
        'data/amigos.json',
        'utf8'
      )
    );

  const resultado = {};

  for (const amigo of amigos) {

    try {

      const resposta =
        await fetch(
          `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${amigo.steamid}&include_appinfo=true&include_played_free_games=true`
        );

      const dados =
        await resposta.json();

      resultado[amigo.steamid] =
        dados.response?.games || [];

    } catch {

      resultado[amigo.steamid] = [];

    }

  }

  fs.writeFileSync(
    'data/friend-games.json',
    JSON.stringify(
      resultado,
      null,
      2
    )
  );

}

main();
