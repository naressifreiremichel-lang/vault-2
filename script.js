async function carregarSteam() {
  const resposta = await fetch('./data/steam.json');
  const dados = await resposta.json();

  const jogos = dados.response.games || [];

  const container = document.getElementById('games');

  container.innerHTML = '';

  jogos
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .forEach(jogo => {
      const horas = Math.round(jogo.playtime_forever / 60);

      const card = document.createElement('div');
      card.className = 'card';

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

carregarSteam();
