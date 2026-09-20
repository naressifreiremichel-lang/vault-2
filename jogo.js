const params =
  new URLSearchParams(
    window.location.search
  );

const appid =
  params.get('appid');

async function carregarJogo() {

  const resposta =
    await fetch('./data/conquistas.json');

  const dados =
    await resposta.json();

  const jogo =
    dados[appid];

  if (!jogo) {

    document.getElementById(
      'nomeJogo'
    ).textContent =
      'Jogo não encontrado';

    return;

  }

  document.getElementById(
    'nomeJogo'
  ).textContent =
    jogo.nome;

  document.getElementById(
    'progresso'
  ).textContent =
    `${jogo.desbloqueadas}/${jogo.total} conquistas • ${jogo.percentual}% completo`;

  document.getElementById(
    'desbloqueadas'
  ).textContent =
    jogo.desbloqueadas;

  document.getElementById(
    'total'
  ).textContent =
    jogo.total;

  document.getElementById(
    'percentual'
  ).textContent =
    jogo.percentual + '%';

  document.getElementById(
    'banner'
  ).style.backgroundImage =
    `
    linear-gradient(
      rgba(0,0,0,.3),
      rgba(0,0,0,.7)
    ),
    url(
      "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg"
    )
    `;

}

carregarJogo();
