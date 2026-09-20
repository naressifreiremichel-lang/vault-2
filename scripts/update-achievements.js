const fs = require('fs');

const API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

async function executar() {

  const steam = JSON.parse(
    fs.readFileSync(
      'data/steam.json',
      'utf8'
    )
  );

  const jogos =
    steam.response.games || [];

  const conquistas = {};

  for (const jogo of jogos) {

    try {

      console.log(
        `Buscando ${jogo.name}`
      );

      const resposta =
        await fetch(
          `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${API_KEY}&steamid=${STEAM_ID}&appid=${jogo.appid}`
        );

      const dados =
        await resposta.json();

      const lista =
        dados.playerstats
          ?.achievements || [];

      const desbloqueadas =
        lista.filter(
          a => a.achieved === 1
        ).length;

      const total =
        lista.length;

      const percentual =
        total > 0
          ? Math.round(
              (desbloqueadas / total) * 100
            )
          : 0;

      conquistas[jogo.appid] = {
        nome: jogo.name,
        desbloqueadas,
        total,
        percentual
      };

    } catch (erro) {

      console.log(
        `Erro em ${jogo.name}`
      );

      conquistas[jogo.appid] = {
        nome: jogo.name,
        desbloqueadas: 0,
        total: 0,
        percentual: 0
      };

    }

  }

  fs.writeFileSync(
    'data/conquistas.json',
    JSON.stringify(
      conquistas,
      null,
      2
    )
  );

  console.log(
    'conquistas.json atualizado'
  );

}

executar();
