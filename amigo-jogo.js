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

    await carregarConquistas();

  } catch (erro) {

    console.error(
      'Erro ao carregar jogo:',
      erro
    );

  }

}


/* =========================
   CARREGAR CONQUISTAS
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

          <h3>
            🏆 Conquistas
          </h3>

          <p>
            Nenhuma conquista encontrada.
          </p>

        </div>

      `;

      return;

    }


    /* =========================
       RESUMO
    ========================= */

    let html = `

      <div class="achievement-summary">

        <h2>
          🏆 Conquistas
        </h2>

        <p class="achievement-number">
          ${jogo.desbloqueadas} / ${jogo.total}
        </p>

        <p class="achievement-percent">
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

          /* =========================
             NOME
          ========================= */

          const nome =
            conquista.nome ||
            conquista.displayName ||
            conquista.displayname ||
            conquista.apiName ||
            conquista.apiname ||
            'Conquista sem nome';


          /* =========================
             STATUS
          ========================= */

          const desbloqueada =
            conquista.desbloqueada === true ||
            conquista.desbloqueada === 1 ||
            conquista.achieved === true ||
            conquista.achieved === 1;


          /* =========================
             IMAGEM REAL
          ========================= */

          let icone = '';

          if (desbloqueada) {

            icone =
              conquista.icone ||
              conquista.icon ||
              '';

          } else {

            icone =
              conquista.iconeCinza ||
              conquista.icongray ||
              conquista.icone ||
              conquista.icon ||
              '';

          }


          /* =========================
             HTML DA IMAGEM
          ========================= */

          let imagemHTML = '';

          if (icone) {

            imagemHTML = `

              <img
                src="${icone}"
                alt="${nome}"
                class="achievement-image"
                loading="lazy"
              >

            `;

          } else {

            imagemHTML = `

              <div class="achievement-sem-icone">
                🏆
              </div>

            `;

          }


          /* =========================
             CARD
          ========================= */

          html += `

            <div class="achievement-item">

              <div class="achievement-icon">

                ${imagemHTML}

              </div>


              <div class="achievement-info">

                <h3>
                  ${nome}
                </h3>


                ${
                  conquista.descricao
                    ? `
                      <p>
                        ${conquista.descricao}
                      </p>
                    `
                    : ''
                }


                <span
                  class="${
                    desbloqueada
                      ? 'achievement-unlocked'
                      : 'achievement-locked'
                  }"
                >

                  ${
                    desbloqueada
                      ? '✅ Desbloqueada'
                      : '❌ Bloqueada'
                  }

                </span>

              </div>

            </div>

          `;

        }
      );


      html += `

        </div>

      `;

    } else {

      html += `

        <div class="stat">

          <p>
            As conquistas individuais
            não estão disponíveis.
          </p>

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

          <h3>
            🏆 Conquistas
          </h3>

          <p>
            Erro ao carregar conquistas.
          </p>

        </div>

      `;

    }

  }

}


/* =========================
   INICIAR
========================= */

carregarJogo();
