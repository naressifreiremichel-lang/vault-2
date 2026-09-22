const fs = require('fs');

async function main() {

  const apiKey =
    process.env.STEAM_API_KEY;

  const jogosPorAmigo =
    JSON.parse(
      fs.readFileSync(
        'data/friend-games.json',
        'utf8'
      )
    );

  const resultado = {};

  for (const steamid of Object.keys(jogosPorAmigo)) {

    resultado[steamid] = {};

    const jogos =
      jogosPorAmigo[steamid];

    for (const jogo of jogos) {

      try {

        const resposta =
          await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamid}&appid=${jogo.appid}`
          );

        const dados =
          await resposta.json();

        const conquistas =
          dados.playerstats
            ?.achievements || [];

        const desbloqueadas =
          conquistas.filter(
            a => a.achieved === 1
          ).length;

        const total =
          conquistas.length;

        const percentual =
          total > 0
            ? Math.round(
                desbloqueadas /
                total *
                100
              )
            : 0;

        resultado[steamid][jogo.appid] = {

          nome:
            jogo.name,

          desbloqueadas,

          total,

          percentual,

          achievements:
            conquistas.map(
              conquista => ({

                apiName:
                  conquista.apiname,

                desbloqueada:
                  conquista.achieved === 1

              })
            )

        };

      } catch (erro) {

        console.log(
          `Erro no jogo ${jogo.appid}`
        );

      }

    }

  }

  fs.writeFileSync(
    'data/friend-achievements.json',
    JSON.stringify(
      resultado,
      null,
      2
    )
  );

  console.log(
    'friend-achievements.json gerado'
  );

}

main();
