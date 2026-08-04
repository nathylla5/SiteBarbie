const rapunzel = 'https://archive.org/embed/BarbieComoRapunzel2002';
const quebraNozes = 'https://archive.org/embed/BarbieEmOQuebraNozes20011';
const lagoCisnes = 'https://archive.org/embed/BarbieLagoDosCisnes20031_201711';
const princesaPlebeia = 'https://player.vimeo.com/video/445744954?h=452556e305';
const fairytopia = 'https://archive.org/embed/BarbieFairytopiaMermaidia2006';
const magiaAladus = 'https://archive.org/embed/BarbieEAMagiaDeAladus';
const magiaArcoIris = 'https://archive.org/embed/BarbieFairytopiaAMagiaDoArcoIris';


function abrirVideo(video) {
    const url = eval(video);
    window.location.href = `video.html?v=${encodeURIComponent(url)}`;
}

document.getElementById('showCadastro').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('loginContainer').classList.remove('active');
    document.getElementById('cadastroContainer').classList.add('active');
});

document.getElementById('showLogin').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('cadastroContainer').classList.remove('active');
    document.getElementById('loginContainer').classList.add('active');
});

document.getElementById('cadastroForm').addEventListener('submit', function (event) {
    event.preventDefault();
    console.log("ALOU'")
    const email = document.getElementById('cadastroEmail').value;
    const senha = document.getElementById('cadastroSenha').value;

    // Salvar os dados no localStorage (apenas para fins de exemplo)
    localStorage.setItem('email', email);
    localStorage.setItem('senha', senha);

    alert('Cadastro realizado com sucesso!');
    document.getElementById('showLogin').click();
});

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Verificar os dados no localStorage (apenas para fins de exemplo)
    const storedEmail = localStorage.getItem('email');
    const storedSenha = localStorage.getItem('senha');

    if (email === storedEmail && senha === storedSenha) {
        alert('Login realizado com sucesso!');
        window.location = './html/home.html';
    } else {
        alert('Email ou senha incorretos.');
    }
});
