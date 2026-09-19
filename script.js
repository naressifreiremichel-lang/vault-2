const games = [
{
name:"Counter-Strike 2",
hours:1200,
image:"https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"
},
{
name:"GTA V",
hours:500,
image:"https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg"
},
{
name:"Rust",
hours:800,
image:"https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg"
}
]

document.getElementById("username").textContent =
"Michel"

document.getElementById("status").textContent =
"Online"

games.forEach(game=>{

document.getElementById("games").innerHTML +=

`
<div class="card">

<img src="${game.image}">

<div class="card-content">

<h3>${game.name}</h3>

<p>${game.hours} horas</p>

</div>

</div>
`

})