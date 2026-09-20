const fs = require('fs');

try {

  const steam =
    JSON.parse(
      fs.readFileSync(
        'data/steam.json',
        'utf8'
      )
    );

  const jogos =
    steam.response.games || [];

  const conquistas = {};

  jogos.forEach(jogo => {

    conquistas[jogo.appid] = {
      nome: jogo.name,
      desbloqueadas: 0,
      total: 0
    };

  });

  fs.writeFileSync(
    'data/conquistas.json',
    JSON.stringify(
      conquistas,
      null,
      2
    )
  );

  console.log(
    'conquistas.json gerado'
  );

} catch (erro) {

  console.error(erro);

}
