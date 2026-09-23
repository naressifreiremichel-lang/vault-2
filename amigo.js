const params =
  new URLSearchParams(
    window.location.search
  );

const steamid =
  params.get('steamid');

async function carregarAmigo() {

  const respostaAmigos =
    await fetch('./data/amigos.json');

  const amigos =
    await respostaAmigos.json();

  const amigo =
    amigos.find(
      a => a.steamid === steamid
    );

  if (!amigo) {

    document.getElementById(
      'nome'
    ).textContent =
      'Amigo não encontrado';

    return;

  }

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
if (
  amigo.nome ===
  'Ovos Graudos'
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
        src="audio/ovos-graudos.mp3"
        type="audio/mpeg"
      >

    </audio>

  `;

}
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

  jogos.sort(
    (a, b) =>
      b.playtime_forever -
      a.playtime_forever
  );

  biblioteca.innerHTML = '';

  jogos.forEach(jogo => {

    const horas =
      Math.round(
        jogo.playtime_forever / 60
      );

    biblioteca.innerHTML += `

      <a
        href="amigo-jogo.html?steamid=${steamid}&appid=${jogo.appid}"
        style="text-decoration:none;color:inherit;"
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
              ⏱️ ${horas} horas
            </p>

          </div>

        </div>

      </a>

    `;

  });

}

carregarAmigo();
