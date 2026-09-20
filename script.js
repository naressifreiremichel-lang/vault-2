function animarNumero(elemento, valorFinal) {

  let valorAtual = 0;

  const incremento =
    Math.max(1, Math.ceil(valorFinal / 60));

  const timer = setInterval(() => {

    valorAtual += incremento;

    if (valorAtual >= valorFinal) {

      valorAtual = valorFinal;

      clearInterval(timer);

    }

    elemento.textContent = valorAtual;

  }, 20);

}

async function carregarPerfil() {

  const resposta =
    await fetch('./data/perfil.json');

  const dados =
    await resposta.json();

  const perfil =
    dados.response.players[0];

  document.getElementById('avatar').src =
    perfil.avatarfull;

  document.getElementById('nome').textContent =
    perfil.personaname;

  let status = 'Offline';

  if (perfil.gameextrainfo) {

    status =
      'Jogando ' + perfil.gameextrainfo;

  } else if (perfil.personastate === 1) {

    status = 'Online';

  }

  document.getElementById('status').textContent =
    status;
}

async function carregarSteam() {

  const resposta =
    await fetch('./data/steam.json');

  const dados =
    await resposta.json();

  const jogos =
    dados.response.games || [];

  document.getElementById('totalJogos').textContent =
    jogos.length + ' jogos';

  animarNumero(
    document.getElementById('statJogos'),
    jogos.length
  );

  const horasTotais =
    jogos.reduce(
      (total, jogo) =>
        total + jogo.playtime_forever,
      0
    );

  animarNumero(
    document.getElementById('statHoras'),
    Math.round(horasTotais / 60)
  );

  const maisJogado =
    [...jogos]
      .sort(
        (a, b) =>
          b.playtime_forever -
          a.playtime_forever
      )[0];

  document.getElementById('statTop').textContent =
    maisJogado.name;

  const container =
    document.getElementById('games');

  const topGames =
    document.getElementById('topGames');

  const pesquisa =
    document.getElementById('pesquisa');

  const top3 =
    [...jogos]
      .sort(
        (a, b) =>
          b.playtime_forever -
          a.playtime_forever
      )
      .slice(0, 3);

  topGames.innerHTML = '';

  top3.forEach(jogo => {

    const horas =
      Math.round(
        jogo.playtime_forever / 60
      );

    const card =
      document.createElement('div');

    card.className =
      'top-card';

    card.innerHTML = `
      <img
        src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${jogo.appid}/header.jpg"
        alt="${jogo.name}"
      >

      <h3>${jogo.name}</h3>

      <p>${horas} horas</p>
    `;

    topGames.appendChild(card);

  });

  function renderizar(lista) {

    container.innerHTML = '';

    lista
      .sort(
        (a, b) =>
          b.playtime_forever -
          a.playtime_forever
      )
      .forEach(jogo => {

        const horas =
          Math.round(
            jogo.playtime_forever / 60
          );

        const card =
          document.createElement('div');

        card.className =
          'card';

        card.innerHTML = `
          <img
            src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${jogo.appid}/header.jpg"
            alt="${jogo.name}"
          >

          <h3>${jogo.name}</h3>

          <p>${horas} horas</p>
        `;

        container.appendChild(card);

      });

  }

  renderizar(jogos);

  pesquisa.addEventListener('input', () => {

    const texto =
      pesquisa.value.toLowerCase();

    const filtrados =
      jogos.filter(jogo =>
        jogo.name
          .toLowerCase()
          .includes(texto)
      );

    renderizar(filtrados);

  });

}

carregarPerfil();
carregarSteam();
