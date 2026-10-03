const params =
  new URLSearchParams(
    window.location.search
  );


const steamid =
  params.get('steamid');


const appid =
  params.get('appid');


/* =========================
   CARREGAR JOGO
========================= */

async function carregarJogo() {

  const respostaJogos =
    await fetch(
      './data/friend-games.json'
    );


  const dadosJogos =
    await respostaJogos.json();


  const jogos =
    dadosJogos[steamid] || [];


  const jogo =
    jogos.find(
      j =>
        String(j.appid) ===
        String(appid)
    );


  if (!jogo) {

    document.getElementById(
      'nomeJogo'
    ).textContent =
      'Jogo não encontrado';

    return;

  }


  /* =========================
     HORAS E MINUTOS
  ========================= */

  const horas =
    Math.floor(
      jogo.playtime_forever / 60
    );


  const minutos =
    jogo.playtime_forever % 60;


  const tempoFormatado =
    `${horas}h ${String(minutos).padStart(2, '0')}min`;


  /* =========================
     NOME
  ========================= */

  document.getElementById(
    'nomeJogo'
  ).textContent =
    jogo.name;


  /* =========================
     TEMPO NO BANNER
  ========================= */

  document.getElementById(
    'horas'
  ).textContent =
    `⏱️ ${tempoFormatado}`;


  /* =========================
     TEMPO TOTAL
  ========================= */

  document.getElementById(
    'horasTotal'
  ).textContent =
    tempoFormatado;


  /* =========================
     APP ID
  ========================= */

  document.getElementById(
    'appid'
  ).textContent =
    jogo.appid;


  /* =========================
     BANNER
  ========================= */

  document.getElementById(
    'banner'
  ).style.backgroundImage =
    `
    linear-gradient(
      rgba(0,0,0,.3),
      rgba(0,0,0,.8)
    ),
    url(
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${jogo.appid}/header.jpg"
    )
    `;


  /* =========================
     CONQUISTAS
  ========================= */

  carregarConquistas();

}


/* =========================
   CONQUISTAS
========================= */

async function carregarConquistas() {

  try {

    const resposta =
      await fetch(
        './data/friend-achievements.json'
      );


    const dados =
      await resposta.json();


    const jogo =
      dados?.[steamid]?.[appid];


    const container =
      document.getElementById(
        'conquistas'
      );


    if (!container) {
      return;
    }


    if (!jogo) {

      container.innerHTML = `

        <div class="stat">

          Nenhuma conquista encontrada.

        </div>

      `;

      return;

    }


    let html = `

      <div class="stat">

        <h2>
          🏆 Conquistas
        </h2>

        <p>
          ${jogo.desbloqueadas}
          /
          ${jogo.total}
        </p>

        <p>
          ${jogo.percentual}%
        </p>

      </div>

    `;


    /* =========================
       CONQUISTAS INDIVIDUAIS
    ========================= */

    if (
      jogo.achievements &&
      jogo.achievements.length
    ) {

      html += `

        <div class="games-grid">

      `;


      jogo.achievements.forEach(
        conquista => {

          html += `

            <div class="game-card">

              <div class="game-content">

                <h3>
                  🏆
                  ${conquista.apiName}
                </h3>

                <p>

                  ${
                    conquista.desbloqueada
                      ? '✅ Desbloqueada'
                      : '❌ Bloqueada'

                  }

                </p>

              </div>

            </div>

          `;

        }
      );


      html += `

        </div>

      `;

    }


    container.innerHTML =
      html;


  } catch (erro) {

    console.error(
      'Erro ao carregar conquistas:',
      erro
    );

  }

}


/* =========================
   INICIAR
========================= */

carregarJogo();
