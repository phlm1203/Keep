/* ==========================================================
   INDICADOR DE PROGRESSO
========================================================== */

const secoes = document.querySelectorAll('#scrollBox section');
const containerProgresso = document.getElementById('progresso');

secoes.forEach((secao, indice) => {
  const bolha = document.createElement('button');
  bolha.setAttribute('aria-label', 'Ir para ' + (secao.id || 'seção ' + (indice + 1)));

  if (indice === 0) {
    bolha.classList.add('ativo');
  }

  bolha.addEventListener('click', () => {
    secao.scrollIntoView({ behavior: 'smooth' });
  });

  containerProgresso.appendChild(bolha);
});

const bolhas = containerProgresso.querySelectorAll('button');

const observer = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        const indice = Array.from(secoes).indexOf(entrada.target);
        bolhas.forEach((b) => b.classList.remove('ativo'));
        bolhas[indice].classList.add('ativo');
      }
    });
  },
  {
    threshold: 0.5,
    root: document.getElementById('scrollBox')
  }
);

secoes.forEach((secao) => observer.observe(secao));

/* ==========================================================
   BOTÃO VOLTAR AO TOPO
========================================================== */
const btnTopo = document.getElementById('btnTopo');
const scrollBox = document.getElementById('scrollBox');

scrollBox.addEventListener('scroll', () => {
  if (scrollBox.scrollTop > 300) {
    btnTopo.classList.add('visivel');
  } else {
    btnTopo.classList.remove('visivel');
  }
});

btnTopo.addEventListener('click', () => {
  scrollBox.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================================
   ANIMAÇÃO DE ENTRADA
========================================================== */
const elementosAnimados = document.querySelectorAll('.anima-entrada');

const observerAnimacao = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
      } else {
        entrada.target.classList.remove('visivel');
      }
    });
  },
  { threshold: 0.15, root: document.getElementById('scrollBox') }
);

elementosAnimados.forEach((el) => observerAnimacao.observe(el));

elementosAnimados.forEach((elemento) => observerAnimacao.observe(elemento));


/* ==========================================================
   FORMULÁRIO DE CADASTRO
========================================================== */

const form = document.getElementById('formCadastro');
const mensagemSucesso = document.getElementById('mensagemSucesso');


/* ==========================================================
   1. SELEÇÃO DE PLANO
========================================================== */
const checkboxesPlano = document.querySelectorAll('.plano-checkbox');

checkboxesPlano.forEach((caixa) => {
  caixa.addEventListener('change', () => {
    if (caixa.checked) {
      // desmarca todas as outras, deixando só esta marcada
      checkboxesPlano.forEach((outra) => {
        if (outra !== caixa) {
          outra.checked = false;
        }
      });
    }
  });
});


/* ==========================================================
   2. VALIDAÇÃO E ENVIO
========================================================== */

// pequenas funções de validação, uma por tipo de dado
function validarNome(valor) {
  return valor.trim().length >= 3;
}

function validarEmail(valor) {
  // regex simples: algo@algo.algo — suficiente pra validação
  // de formulário no front-end (a validação "de verdade" é
  // sempre feita no back-end, isso aqui é só uma primeira barreira)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
}

function validarTelefone(valor) {
  // aceita formatos como (11) 91234-5678, 11912345678, etc.
  // exige pelo menos 10 dígitos numéricos
  const apenasNumeros = valor.replace(/\D/g, '');
  return apenasNumeros.length >= 10;
}

function validarEndereco(valor) {
  return valor.trim().length >= 5;
}

function validarPlano() {
  return Array.from(checkboxesPlano).some((caixa) => caixa.checked);
}

// mostra (ou limpa) a mensagem de erro de um campo específico
function definirErro(nomeDoCampo, mensagem) {
  const spanErro = document.querySelector(`[data-erro-de="${nomeDoCampo}"]`);
  const input = document.getElementById(nomeDoCampo);

  if (spanErro) {
    spanErro.textContent = mensagem;
  }

  // o campo "plano" não é um <input>, então só mexe na borda
  // se realmente existir um input correspondente
  if (input) {
    input.classList.toggle('campo-invalido', Boolean(mensagem));
  }
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault(); // impede o recarregamento padrão da página

  // pega os valores atuais de cada campo
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const telefone = document.getElementById('telefone').value;
  const endereco = document.getElementById('endereco').value;

  // roda todas as validações, guardando se passou (true) ou não (false)
  const nomeValido = validarNome(nome);
  const emailValido = validarEmail(email);
  const telefoneValido = validarTelefone(telefone);
  const enderecoValido = validarEndereco(endereco);
  const planoValido = validarPlano();

  // atualiza a mensagem de erro de cada campo (limpa se estiver ok)
  definirErro('nome', nomeValido ? '' : 'Digite seu nome completo.');
  definirErro('email', emailValido ? '' : 'Digite um e-mail válido.');
  definirErro('telefone', telefoneValido ? '' : 'Digite um telefone válido, com DDD.');
  definirErro('endereco', enderecoValido ? '' : 'Digite seu endereço completo.');
  definirErro('plano', planoValido ? '' : 'Selecione um plano.');

  const formularioValido =
    nomeValido && emailValido && telefoneValido && enderecoValido && planoValido;

  if (!formularioValido) {
    mensagemSucesso.classList.remove('visivel');
    return; // para aqui — não "envia" nada se algum campo estiver errado
  }

  // ====================================================
  // A PARTIR DAQUI é onde entraria o envio de verdade
  // (fetch pra uma API, Google Forms, Firebase, etc.)
  // Por enquanto, só monta o objeto com os dados e mostra
  // no console — é o ponto exato pra você plugar o back-end
  // quando tiver um.
  // ====================================================
  const planoEscolhido = Array.from(checkboxesPlano).find((c) => c.checked).value;

  const dadosCadastro = {
    nome: nome.trim(),
    email: email.trim(),
    telefone: telefone.trim(),
    endereco: endereco.trim(),
    plano: planoEscolhido
  };

  console.log('Dados do cadastro:', dadosCadastro);

  // feedback visual de sucesso pro usuário
  mensagemSucesso.classList.add('visivel');
  form.reset();
  checkboxesPlano.forEach((c) => (c.checked = false)); // reset() não desmarca sozinho em alguns navegadores
});