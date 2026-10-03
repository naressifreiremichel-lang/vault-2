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

  try {

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
       NOME DO JOGO
    ========================= */

    document.getElementById(
      'nomeJogo'
    ).textContent =
      jogo.name;


    document.getElementById(
      'horas'
    ).textContent =
      `⏱️ ${tempoFormatado}`;


    document.getElementById(
      'horasTotal'
    ).textContent =
      tempoFormatado;


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

    await carregarConquistas();


  } catch (erro) {

    console.error(
      'Erro ao carregar jogo:',
      erro
    );

  }

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


    /* =========================
       NENHUMA CONQUISTA
    ========================= */

    if (!jogo) {

      container.innerHTML = `

        <div class="stat">

          Nenhuma conquista encontrada.

        </div>

      `;

      return;

    }


    /* =========================
       RESUMO
    ========================= */

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
      Array.isArray(
        jogo.achievements
      ) &&
      jogo.achievements.length > 0
    ) {

      html += `

        <div class="achievements-list">

      `;


      jogo.achievements.forEach(
        conquista => {


          /*
             Procura o nome da conquista
             em vários campos possíveis.
          */

          const nome =
            conquista.displayName ||
            conquista.displayname ||
            conquista.name ||
            conquista.apiName ||
            conquista.apiname ||
            'Conquista sem nome';


          /*
             Verifica se foi desbloqueada.
          */

          const desbloqueada =
            conquista.desbloqueada === true ||
            conquista.desbloqueada === 1 ||
            conquista.achieved === true ||
            conquista.achieved === 1;


          html += `

            <div class="achievement-item">

              <div class="achievement-name">

                <span class="trofeu">
                  🏆
                </span>

                <strong>
                  ${nome}
                </strong>

              </div>

              <div class="achievement-status">

                ${
                  desbloqueada
                    ? '✅ Desbloqueada'
                    : '❌ Bloqueada'
                }

              </div>

            </div>

          `;

        }
      );


      html += `

        </div>

      `;

    }


    /* =========================
       MOSTRAR NA PÁGINA
    ========================= */

    container.innerHTML =
      html;


  } catch (erro) {

    console.error(
      'Erro ao carregar conquistas:',
      erro
    );


    const container =
      document.getElementById(
        'conquistas'
      );


    if (container) {

      container.innerHTML = `

        <div class="stat">

          Erro ao carregar conquistas.

        </div>

      `;

    }

  }

}


/* =========================
   INICIAR
========================= */

carregarJogo();
