function animarNumero(elemento, valorFinal, aoTerminar = null) {

  let valorAtual = 0;

  const incremento =
    Math.max(1, Math.ceil(valorFinal / 60));

  const timer = setInterval(() => {

    valorAtual += incremento;

    if (valorAtual >= valorFinal) {

      valorAtual = valorFinal;

      clearInterval(timer);

      if (aoTerminar) {
        aoTerminar();
      }

    }

    elemento.textContent = valorAtual;

  }, 20);

}


/* =========================
   PERFIL
========================= */

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
      'Jogando ' +
      perfil.gameextrainfo;

  } else if (perfil.personastate === 1) {

    status = 'Online';

  }

  document.getElementById('status').textContent =
    status;

}


/* =========================
   STEAM
========================= */

async function carregarSteam() {

  const resposta =
    await fetch('./data/steam.json');

  const dados =
    await resposta.json();

  const jogos =
    dados.response.games || [];


  /* =========================
     TOTAL DE JOGOS
  ========================= */

  document.getElementById('totalJogos').textContent =
    jogos.length + ' jogos';

  animarNumero(
    document.getElementById('statJogos'),
    jogos.length
  );


  /* =========================
     HORAS TOTAIS
  ========================= */

  const minutosTotais =
    jogos.reduce(
      (total, jogo) =>
        total + jogo.playtime_forever,
      0
    );

  const horasTotais =
    Math.floor(minutosTotais / 60);

  const minutosRestantes =
    minutosTotais % 60;


  const elementoHoras =
    document.getElementById('statHoras');


  /*
     Primeiro anima as horas.
     Quando terminar, mostra
     horas + minutos.
  */

  animarNumero(
    elementoHoras,
    horasTotais,
    () => {

      elementoHoras.textContent =
        `${horasTotais}h ${String(minutosRestantes).padStart(2, '0')}min`;

    }
  );


  /* =========================
     MAIS JOGADO
  ========================= */

  const maisJogado =
    [...jogos]
      .sort(
        (a, b) =>
          b.playtime_forever -
          a.playtime_forever
      )[0];


  if (maisJogado) {

    document.getElementById('statTop').textContent =
      maisJogado.name;

  }


  /* =========================
     CONTAINERS
  ========================= */

  const container =
    document.getElementById('games');

  const topGames =
    document.getElementById('topGames');

  const topChart =
    document.getElementById('topChart');

  const pesquisa =
    document.getElementById('pesquisa');


  /* =========================
     ORDENAR JOGOS
  ========================= */

  const jogosOrdenados =
    [...jogos].sort(
      (a, b) =>
        b.playtime_forever -
        a.playtime_forever
    );


  const top3 =
    jogosOrdenados.slice(0, 3);

  const top5 =
    jogosOrdenados.slice(0, 5);


  /* =========================
     TOP 3
  ========================= */

  topGames.innerHTML = '';


  top3.forEach(jogo => {

    const horas =
      Math.floor(
        jogo.playtime_forever / 60
      );

    const minutos =
      jogo.playtime_forever % 60;


    const card =
      document.createElement('div');

    card.className =
      'top-card';


    card.innerHTML = `

      <img
        src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${jogo.appid}/header.jpg"
        alt="${jogo.name}"
      >

      <h3>
        ${jogo.name}
      </h3>

      <p>
        ⏱️ ${horas}h ${String(minutos).padStart(2, '0')}min
      </p>

    `;


    topGames.appendChild(card);

  });


  /* =========================
     GRÁFICO TOP 5
  ========================= */

  if (topChart) {

    topChart.innerHTML = '';


    const maiorTempo =
      top5[0]?.playtime_forever || 1;


    top5.forEach(jogo => {

      const horas =
        Math.floor(
          jogo.playtime_forever / 60
        );

      const minutos =
        jogo.playtime_forever % 60;


      const porcentagem =
        (jogo.playtime_forever /
          maiorTempo) * 100;


      topChart.innerHTML += `

        <div class="chart-row">

          <div class="chart-info">

            <span>
              ${jogo.name}
            </span>

            <span>
              ${horas}h ${String(minutos).padStart(2, '0')}min
            </span>

          </div>


          <div class="chart-bar-bg">

            <div
              class="chart-bar"
              style="width:${porcentagem}%"
            ></div>

          </div>

        </div>

      `;

    });

  }


  /* =========================
     BIBLIOTECA
  ========================= */

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
          Math.floor(
            jogo.playtime_forever / 60
          );


        const minutos =
          jogo.playtime_forever % 60;


        const card =
          document.createElement('div');


        card.className =
          'card';


        card.innerHTML = `

          <img
            src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${jogo.appid}/header.jpg"
            alt="${jogo.name}"
          >

          <h3>
            ${jogo.name}
          </h3>

          <p>
            ⏱️ ${horas}h ${String(minutos).padStart(2, '0')}min
          </p>

        `;


        container.appendChild(card);

      });

  }


  /* =========================
     MOSTRAR TODOS OS JOGOS
  ========================= */

  renderizar(jogos);


  /* =========================
     PESQUISA
  ========================= */

  pesquisa.addEventListener(
    'input',
    () => {

      const texto =
        pesquisa.value.toLowerCase();


      const filtrados =
        jogos.filter(jogo =>
          jogo.name
            .toLowerCase()
            .includes(texto)
        );


      renderizar(filtrados);

    }
  );

}


/* =========================
   CONQUISTAS
========================= */

async function carregarConquistas() {

  try {

    const resposta =
      await fetch(
        './data/conquistas.json'
      );


    const dados =
      await resposta.json();


    const totalJogos =
      Object.keys(dados).length;


    const fill =
      document.getElementById(
        'achievementFill'
      );


    const texto =
      document.getElementById(
        'achievementText'
      );


    fill.style.width =
      '100%';


    texto.textContent =
      totalJogos +
      ' jogos encontrados no sistema de conquistas';


  } catch {

    document.getElementById(
      'achievementText'
    ).textContent =
      'Erro ao carregar conquistas';

  }

}


/* =========================
   INICIAR
========================= */

carregarPerfil();

carregarSteam();

carregarConquistas();
