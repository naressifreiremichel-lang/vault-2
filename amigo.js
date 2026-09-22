const params =
  new URLSearchParams(
    window.location.search
  );

const steamid =
  params.get('steamid');

async function carregarAmigo() {

  const resposta =
    await fetch('./data/amigos.json');

  const amigos =
    await resposta.json();

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

}

carregarAmigo();
