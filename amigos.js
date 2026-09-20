async function carregarAmigos() {

  const container =
    document.getElementById('amigos');

  container.innerHTML =
    '<p>Carregando amigos...</p>';

  try {

    const resposta =
      await fetch('./data/amigos.json');

    const amigos =
      await resposta.json();

    container.innerHTML = '';

    amigos.forEach(amigo => {

      container.innerHTML += `

      <div class="amigo">

        <img
          src="${amigo.avatar}"
          alt="${amigo.nome}"
        >

        <div>

          <div class="nome">
            ${amigo.nome}
          </div>

          <div class="status">
            ${amigo.status}
          </div>

        </div>

      </div>

      `;

    });

  } catch {

    container.innerHTML =
      '<p>Erro ao carregar amigos.</p>';

  }

}

carregarAmigos();
