const rapunzel = 'https://archive.org/embed/BarbieComoRapunzel2002';
const quebraNozes = 'https://archive.org/embed/BarbieEmOQuebraNozes20011';
const lagoCisnes = 'https://archive.org/embed/BarbieLagoDosCisnes20031_201711';
const princesaPlebeia = 'https://player.vimeo.com/video/445744954?h=452556e305';
const fairytopia = 'https://archive.org/embed/BarbieFairytopiaMermaidia2006';
const magiaAladus = 'https://archive.org/embed/BarbieEAMagiaDeAladus';
const magiaArcoIris = 'https://archive.org/embed/BarbieFairytopiaAMagiaDoArcoIris'


function abrirVideo(video) {
  const url = eval(video); // Avalia a variável com base na palavra-chave
  window.location.href = `video.html?v=${encodeURIComponent(url)}`;
}