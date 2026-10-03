const params =
  new URLSearchParams(
    window.location.search
  );

const steamid =
  params.get('steamid');


async function carregarAmigo() {

  const respostaAmigos =
    await fetch(
      './data/amigos.json'
    );

  const amigos =
    await respostaAmigos.json();


  const amigo =
    amigos.find(
      a =>
        a.steamid === steamid
    );


  if (!amigo) {

    document.getElementById(
      'nome'
    ).textContent =
      'Amigo não encontrado';

    return;

  }


  /* =========================
     PERFIL
  ========================= */

  document.getElementById(
    'avatar'
  ).src =
    amigo.avatar;


  document.getElementById(
    'nome'
  ).textContent =
    amigo.nome;


  document.getElementById(
    'status'
  ).textContent =
    amigo.status;


  document.getElementById(
    'status2'
  ).textContent =
    amigo.status;


  document.getElementById(
    'steamid'
  ).textContent =
    amigo.steamid;


  /* =========================
     MÚSICA DO AMIGO
  ========================= */

  if (
    amigo.nome &&
    amigo.nome
      .toLowerCase()
      .includes('ovos')
  ) {

    document.getElementById(
      'musicaAmigo'
    ).innerHTML = `

      <audio
        controls
        autoplay
        loop
        style="
          width:100%;
          margin-top:20px;
        "
      >

        <source
          src="./audio/030bc8fd-15b4-4c68-a809-90c1d24e97d5%20(1)%20(mp3cut.net)%20(3).mp3"
          type="audio/mpeg"
        >

      </audio>

    `;

  }


  /* =========================
     JOGOS
  ========================= */

  const respostaJogos =
    await fetch(
      './data/friend-games.json'
    );


  const jogosPorAmigo =
    await respostaJogos.json();


  const jogos =
    jogosPorAmigo[steamid] || [];


  const biblioteca =
    document.getElementById(
      'biblioteca'
    );


  if (jogos.length === 0) {

    biblioteca.innerHTML = `

      <div class="stat">

        Biblioteca privada
        ou sem jogos visíveis.

      </div>

    `;

    return;

  }


  /* =========================
     ORDENAR POR TEMPO
  ========================= */

  jogos.sort(
    (a, b) =>
      b.playtime_forever -
      a.playtime_forever
  );


  biblioteca.innerHTML = '';


  /* =========================
     MOSTRAR JOGOS
  ========================= */

  jogos.forEach(jogo => {


    const horas =
      Math.floor(
        jogo.playtime_forever / 60
      );


    const minutos =
      jogo.playtime_forever % 60;


    biblioteca.innerHTML += `

      <a
        href="amigo-jogo.html?steamid=${steamid}&appid=${jogo.appid}"
        style="
          text-decoration:none;
          color:inherit;
        "
      >

        <div class="game-card">

          <img
            class="game-banner"
            src="https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${jogo.appid}/header.jpg"
            alt="${jogo.name}"
          >

          <div class="game-content">

            <h3 class="game-title">
              ${jogo.name}
            </h3>

            <p class="game-hours">
              ⏱️ ${horas}h ${String(minutos).padStart(2, '0')}min
            </p>

          </div>

        </div>

      </a>

    `;

  });

}


carregarAmigo();
