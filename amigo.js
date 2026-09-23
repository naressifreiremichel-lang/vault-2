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
        src="./audio/030bc8fd-15b4-4c68-a809-90c1d24e97d5%20(1)%20(mp3cut.net)%20(3).mp3"
        type="audio/mpeg"
      >

    </audio>

  `;

}
