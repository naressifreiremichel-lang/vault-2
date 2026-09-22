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

        const respostaConquistas =
          await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamid}&appid=${jogo.appid}`
          );

        const dadosConquistas =
          await respostaConquistas.json();

        const conquistas =
          dadosConquistas.playerstats
            ?.achievements || [];

        const respostaSchema =
          await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${jogo.appid}`
          );

        const dadosSchema =
          await respostaSchema.json();

        const schemaAchievements =
          dadosSchema.game
            ?.availableGameStats
            ?.achievements || [];

        const listaCompleta =
          conquistas.map(conquista => {

            const schema =
              schemaAchievements.find(
                a =>
                  a.name ===
                  conquista.apiname
              );

            return {

              nome:
                schema?.displayName ||
                conquista.apiname,

              descricao:
                schema?.description ||
                '',

              icone:
                schema?.icon ||
                '',

              iconeCinza:
                schema?.icongray ||
                '',

              desbloqueada:
                conquista.achieved === 1

            };

          });

        const desbloqueadas =
          listaCompleta.filter(
            a => a.desbloqueada
          ).length;

        const total =
          listaCompleta.length;

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
            listaCompleta

        };

        console.log(
          `OK ${jogo.name}`
        );

      } catch (erro) {

        console.log(
          `ERRO ${jogo.name}`
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
