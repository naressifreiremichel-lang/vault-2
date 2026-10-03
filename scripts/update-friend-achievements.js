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


  for (
    const steamid of Object.keys(jogosPorAmigo)
  ) {

    resultado[steamid] = {};


    const jogos =
      jogosPorAmigo[steamid] || [];


    for (const jogo of jogos) {

      try {

        /* =========================
           CONQUISTAS DO JOGADOR
        ========================= */

        const respostaConquistas =
          await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamid}&appid=${jogo.appid}`
          );


        const dadosConquistas =
          await respostaConquistas.json();


        const conquistas =
          dadosConquistas.playerstats
            ?.achievements || [];


        /* =========================
           INFORMAÇÕES DAS CONQUISTAS
        ========================= */

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


        /* =========================
           MONTAR LISTA COMPLETA
        ========================= */

        const listaCompleta =
          conquistas.map(
            conquista => {

              const schema =
                schemaAchievements.find(
                  a =>
                    a.name ===
                    conquista.apiname
                );


              return {

                /*
                  Nome que aparecerá
                  no site
                */

                nome:
                  schema?.displayName ||
                  conquista.apiname ||
                  'Conquista sem nome',


                /*
                  Nome interno da Steam
                */

                apiName:
                  conquista.apiname ||
                  '',


                /*
                  Descrição
                */

                descricao:
                  schema?.description ||
                  '',


                /*
                  Ícone colorido
                */

                icone:
                  schema?.icon ||
                  '',


                /*
                  Ícone cinza
                */

                iconeCinza:
                  schema?.icongray ||
                  '',


                /*
                  1 = desbloqueada
                  0 = bloqueada
                */

                desbloqueada:
                  conquista.achieved === 1

              };

            }
          );


        /* =========================
           ESTATÍSTICAS
        ========================= */

        const desbloqueadas =
          listaCompleta.filter(
            conquista =>
              conquista.desbloqueada
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


        /* =========================
           SALVAR JOGO
        ========================= */

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
          `OK ${jogo.name} - ${desbloqueadas}/${total}`
        );

      } catch (erro) {

        console.log(
          `ERRO ${jogo.name}:`,
          erro.message
        );

      }

    }

  }


  /* =========================
     SALVAR JSON
  ========================= */

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
