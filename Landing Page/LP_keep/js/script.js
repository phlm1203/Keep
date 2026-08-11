/* ==========================================================
   INDICADOR DE PROGRESSO (bolhinhas laterais)

   Ideia geral: pra cada <section> dentro de #scrollBox,
   criamos uma bolha correspondente. Conforme o usuário rola
   a página, detectamos qual seção está visível e marcamos
   a bolha certa como "ativa".
========================================================== */

// pega todas as seções que estão dentro do container de scroll
const secoes = document.querySelectorAll('#scrollBox section');

// div vazia no HTML onde vamos inserir as bolhas
const containerProgresso = document.getElementById('progresso');

// --- 1. cria uma bolha para cada seção ---
secoes.forEach((secao, indice) => {
  const bolha = document.createElement('button');

  // texto acessível pra leitor de tela (a seção nem sempre tem id)
  bolha.setAttribute('aria-label', 'Ir para ' + (secao.id || 'seção ' + (indice + 1)));

  // a primeira bolha já nasce marcada como ativa,
  // porque a página sempre abre na primeira seção
  if (indice === 0) {
    bolha.classList.add('ativo');
  }

  // ao clicar na bolha, rola suavemente até a seção correspondente
  bolha.addEventListener('click', () => {
    secao.scrollIntoView({ behavior: 'smooth' });
  });

  containerProgresso.appendChild(bolha);
});

// guarda a referência das bolhas já criadas, pra usar no observer abaixo
const bolhas = containerProgresso.querySelectorAll('button');

// --- 2. observa qual seção está visível na tela ---
// IntersectionObserver dispara um callback toda vez que um elemento
// observado entra ou sai da área visível (definida em "root").
const observer = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      // só nos interessa quando a seção ENTRA na tela
      if (entrada.isIntersecting) {
        const indice = Array.from(secoes).indexOf(entrada.target);

        // remove "ativo" de todas e liga só na bolha da seção atual
        bolhas.forEach((b) => b.classList.remove('ativo'));
        bolhas[indice].classList.add('ativo');
      }
    });
  },
  {
    threshold: 0.5,                          // considera "visível" a partir de 50% da seção na tela
    root: document.getElementById('scrollBox') // a área de referência é o container de scroll, não a janela toda
  }
);

// manda o observer vigiar cada seção
secoes.forEach((secao) => observer.observe(secao));

/* ==========================================================
   BOTÃO VOLTAR AO TOPO
========================================================== */
const btnTopo = document.getElementById('btnTopo');
const scrollBox = document.getElementById('scrollBox'); // mesmo container usado no indicador de progresso

// mostra o botão só depois que o usuário já rolou um pouco
// (evita ele aparecer já na primeira seção, onde não faz sentido)
scrollBox.addEventListener('scroll', () => {
  if (scrollBox.scrollTop > 300) {
    btnTopo.classList.add('visivel');
  } else {
    btnTopo.classList.remove('visivel');
  }
});

// ao clicar, rola suavemente de volta pro topo do container
btnTopo.addEventListener('click', () => {
  scrollBox.scrollTo({ top: 0, behavior: 'smooth' });
});