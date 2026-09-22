const params =
  new URLSearchParams(
    window.location.search
  );

const steamid =
  params.get('steamid');

const appid =
  params.get('appid');

async function carregarJogo() {

  const resposta =
    await fetch(
      './data/friend-games.json'
    );

  const dados =
    await resposta.json();

  const jogos =
    dados[steamid] || [];

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

  const horas =
    Math.round(
      jogo.playtime_forever / 60
    );

  document.getElementById(
    'nomeJogo'
  ).textContent =
    jogo.name;

  document.getElementById(
    'horas'
  ).textContent =
    `⏱️ ${horas} horas jogadas`;

  document.getElementById(
    'horasTotal'
  ).textContent =
    horas + 'h';

  document.getElementById(
    'appid'
  ).textContent =
    jogo.appid;

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

}

carregarJogo();
