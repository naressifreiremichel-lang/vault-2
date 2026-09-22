async function carregarAmigos() {

  const resposta =
    await fetch('./data/amigos.json');

  const amigos =
    await resposta.json();

  const container =
    document.getElementById('amigos');

  container.innerHTML = '';

  amigos.forEach(amigo => {

    const statusClasse =
      amigo.status.includes('Offline')
        ? 'offline'
        : 'online';

    container.innerHTML += `

    <a
      class="friend-card"
      href="amigo.html?steamid=${amigo.steamid}"
    >

      <img
        class="friend-avatar"
        src="${amigo.avatar}"
        alt="${amigo.nome}"
      >

      <div class="friend-info">

        <h3>
          ${amigo.nome}
        </h3>

        <p class="${statusClasse}">
          ${amigo.status}
        </p>

      </div>

    </a>

    `;

  });

}

carregarAmigos();
