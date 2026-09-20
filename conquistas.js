async function carregarConquistas() {

  const resposta =
    await fetch('./data/conquistas.json');

  const dados =
    await resposta.json();

  const cards =
    document.getElementById('cards');

  const completados =
    document.getElementById('completados');

  const ranking =
    document.getElementById('ranking');

  const jogos =
    Object.entries(dados)
      .map(([appid, info]) => ({
        appid,
        ...info
      }))
      .filter(jogo => jogo.total > 0)
      .sort(
        (a, b) =>
          b.percentual - a.percentual
      );

  document.getElementById(
    'totalJogos'
  ).textContent = jogos.length;

  const totalConquistas =
    jogos.reduce(
      (total, jogo) =>
        total + jogo.desbloqueadas,
      0
    );

  document.getElementById(
    'totalConquistas'
  ).textContent =
    totalConquistas;

  if (jogos.length > 0) {

    const campeao = jogos[0];

    document.getElementById(
      'melhorJogo'
    ).textContent =
      campeao.nome;

    document.getElementById(
      'campeaoNome'
    ).textContent =
      campeao.nome;

    document.getElementById(
      'campeaoTexto'
    ).textContent =
      `${campeao.desbloqueadas}/${campeao.total} conquistas • ${campeao.percentual}% completo`;

    document.getElementById(
      'campeao'
    ).style.backgroundImage =
      `
      linear-gradient(
        rgba(0,0,0,.3),
        rgba(0,0,0,.7)
      ),
      url(
        "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${campeao.appid}/header.jpg"
      )
      `;

  }

  ranking.innerHTML = '';

  jogos
    .slice(0, 10)
    .forEach((jogo, index) => {

      ranking.innerHTML += `

      <div class="ranking-card">

        <div class="ranking-top">

          <span>
            ${
              index === 0 ? '🥇' :
              index === 1 ? '🥈' :
              index === 2 ? '🥉' :
              (index + 1) + '.'
            }
            ${jogo.nome}
          </span>

          <span>
            ${jogo.percentual}%
          </span>

        </div>

        <div class="ranking-bar-bg">

          <div
            class="ranking-bar"
            style="width:${jogo.percentual}%"
          ></div>

        </div>

      </div>

      `;

    });

  completados.innerHTML = '';

  const jogos100 =
    jogos.filter(
      jogo => jogo.percentual >= 100
    );

  jogos100.forEach(jogo => {

    completados.innerHTML += `

    <div class="game-card">

      <img
        class="game-banner"
        src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${jogo.appid}/header.jpg"
        alt="${jogo.nome}"
      >

      <div class="game-content">

        <h3 class="game-title">
          🏆 ${jogo.nome}
        </h3>

        <p class="game-achievements">
          ${jogo.desbloqueadas}/${jogo.total}
          conquistas
        </p>

        <div class="progress-text">
          100% COMPLETO
        </div>

      </div>

    </div>

    `;

  });

  cards.innerHTML = '';

  jogos.forEach(jogo => {

    cards.innerHTML += `

    <div class="game-card">

      <img
        class="game-banner"
        src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${jogo.appid}/header.jpg"
        alt="${jogo.nome}"
      >

      <div class="game-content">

        <h3 class="game-title">
          ${jogo.nome}
        </h3>

        <p class="game-achievements">
          ${jogo.desbloqueadas}
          /
          ${jogo.total}
          conquistas
        </p>

        <div class="progress-bg">

          <div
            class="progress-fill"
            style="width:${jogo.percentual}%"
          ></div>

        </div>

        <div class="progress-text">
          ${jogo.percentual}%
        </div>

      </div>

    </div>

    `;

  });

}

carregarConquistas();
