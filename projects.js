const carousel = document.getElementById("carousel");
const cards = Array.from(document.querySelectorAll(".card"));
const count = cards.length;
const radius = 500;
const spacing = 360 / count;

let rotation = 0;
let targetRotation = 0;

window.addEventListener("wheel", e => {
  targetRotation += e.deltaY * 0.4;
});

function animate() {
  rotation += (targetRotation - rotation) * 0.08;

  cards.forEach((card, i) => {
    const angle = (spacing * i + rotation) * Math.PI / 180;

    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * -radius;

    const depth = (z + radius) / (radius * 2);
    const scale = 0.7 + depth * 0.3;

    card.style.transform = `
  translate(-50%, -50%)
  translate3d(${x}px, 0px, ${z}px)
  scale(${scale})
`;


    card.style.zIndex = Math.round(depth * 100);
    card.classList.toggle("is-back", depth < 0.35);
    card.classList.toggle("is-front", depth > 0.8);
  });

  requestAnimationFrame(animate);
}

animate();
