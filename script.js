// === SLIDER COM AUTOPLAY E PROGRESSO ===
const slider = document.querySelector('.slider');
const progressBar = document.querySelector('.progress-bar');
const autoplayTime = 10000;
const updateStep = 30;
let progress = 0;
let progressStep = (updateStep / autoplayTime) * 100;

let autoplayTimer = setInterval(nextSlide, autoplayTime);

function nextSlide() {
  const items = document.querySelectorAll('.item');
  if (items.length > 0) {
    slider.appendChild(items[0]);
    resetProgress();
  }
}

function resetProgress() {
  progress = 0;
  progressBar.style.width = '0%';
}

function restartAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(nextSlide, autoplayTime);
  resetProgress();
}

setInterval(() => {
  progress += progressStep;
  if (progress >= 100) progress = 0;
  progressBar.style.width = `${progress}%`;
}, updateStep);

// Troca manual (próximo / anterior)
document.addEventListener('click', e => {
  const items = document.querySelectorAll('.item');
  if (e.target.matches('.next')) {
    slider.appendChild(items[0]);
    restartAutoplay();
  }
  if (e.target.matches('.prev')) {
    slider.insertBefore(items[items.length - 1], items[0]);
    restartAutoplay();
  }
});


// === MENU LATERAL ===
const btnMenu = document.querySelector('.btn-menu');
const sideMenu = document.querySelector('.side-menu');
const overlay = document.querySelector('.overlay');

function toggleMenu() {
  const isActive = sideMenu.classList.contains('active');
  sideMenu.classList.toggle('active');
  overlay.classList.toggle('active');
  btnMenu.classList.toggle('open');
  btnMenu.setAttribute('aria-expanded', !isActive);
}

btnMenu.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);
window.addEventListener('keydown', e => {
  if (e.key === "Escape" && sideMenu.classList.contains('active')) toggleMenu();
});


// === DRAG SCROLL NA LINHA DO TEMPO ===
const timelineWrapper = document.getElementById('timelineWrapper');
if (timelineWrapper) {
  let isDown = false, startX, scrollLeft;

  timelineWrapper.addEventListener('mousedown', e => {
    isDown = true;
    timelineWrapper.classList.add('active');
    startX = e.pageX - timelineWrapper.offsetLeft;
    scrollLeft = timelineWrapper.scrollLeft;
  });

  timelineWrapper.addEventListener('mouseleave', () => {
    isDown = false;
    timelineWrapper.classList.remove('active');
  });

  timelineWrapper.addEventListener('mouseup', () => {
    isDown = false;
    timelineWrapper.classList.remove('active');
  });

  timelineWrapper.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - timelineWrapper.offsetLeft;
    const walk = (x - startX) * 2;
    timelineWrapper.scrollLeft = scrollLeft - walk;
  });
}


// === BOTÕES DE SCROLL DA LINHA DO TEMPO ===
const btnPrev = document.querySelector('.timeline-btn.prev');
const btnNext = document.querySelector('.timeline-btn.next');
const scrollAmount = 300;
const scrollDelay = 4000;

function scrollTimelineNext() {
  const maxScroll = timelineWrapper.scrollWidth - timelineWrapper.clientWidth;
  if (timelineWrapper.scrollLeft >= maxScroll - 10) {
    timelineWrapper.scrollTo({ left: 0, behavior: 'smooth' });
  } else {
    timelineWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

function scrollTimelinePrev() {
  if (timelineWrapper.scrollLeft <= 0) {
    const maxScroll = timelineWrapper.scrollWidth - timelineWrapper.clientWidth;
    timelineWrapper.scrollTo({ left: maxScroll, behavior: 'smooth' });
  } else {
    timelineWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }
}

btnNext?.addEventListener('click', () => {
  scrollTimelineNext();
  restartTimelineAutoplay();
});

btnPrev?.addEventListener('click', () => {
  scrollTimelinePrev();
  restartTimelineAutoplay();
});

// Auto-scroll da timeline
let timelineAutoplay = setInterval(scrollTimelineNext, scrollDelay);

function restartTimelineAutoplay() {
  clearInterval(timelineAutoplay);
  timelineAutoplay = setInterval(scrollTimelineNext, scrollDelay);
}

timelineWrapper?.addEventListener('mousedown', restartTimelineAutoplay);


// === FOLHAS ANIMADAS EM HOVER NOS CARDS ===
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    for (let i = 0; i < 10; i++) {
      const folha = document.createElement('img');
      folha.src = 'img/folha.png';
      folha.className = 'folha';
      folha.style.left = `${Math.random() * 100}%`;
      folha.style.width = `${20 + Math.random() * 20}px`;

      const rotateStart = Math.random() * 360;
      const rotateEnd = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 360);
      folha.style.transform = `rotate(${rotateStart}deg)`;
      folha.style.setProperty('--rotate-deg', `${rotateEnd}deg`);
      folha.style.setProperty('--fall-distance', `${100 + Math.random() * 100}px`);

      card.appendChild(folha);
      setTimeout(() => folha.remove(), 2500);
    }
  });
});


// === ANIMAÇÃO DOS GRÁFICOS (SECTION3) ===
const impactSection = document.querySelector('#impact-section');

if (impactSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const visibleRatio = entry.intersectionRatio;

      const bars = impactSection.querySelectorAll('.bar');
      const charts = impactSection.querySelectorAll('.chart');

      if (visibleRatio > 0) {
        // Mostrar barras (animar para altura do valor)
        bars.forEach(bar => {
          const fill = bar.querySelector('.bar-fill');
          const value = parseFloat(bar.getAttribute('data-value')) || 0;
          const max = 800;
          const percent = Math.min((value / max) * 100, 100);
          fill.style.height = `${percent}%`;
        });

        charts.forEach(chart => {
          chart.classList.add('visible');
        });
      } else {
        // Esconder barras somente se sumiu 100%
        bars.forEach(bar => {
          const fill = bar.querySelector('.bar-fill');
          fill.style.height = '0%';
        });

        charts.forEach(chart => {
          chart.classList.remove('visible');
        });
      }
    });
  }, {
    threshold: [0, 0.4] // chama callback em 0% e 40% visível
  });

  observer.observe(impactSection);
}

// ==================================== SECTION 4 ===========================================

const tabs = document.querySelectorAll('.tab');
const title = document.getElementById('section4-title');
const text = document.getElementById('section4-text');

const contentMap = {
  separar: {
    title: "Separar os resíduos em casa",
    text: "A primeira grande mudança começa dentro de casa. Separar o lixo orgânico dos recicláveis é um gesto simples que faz toda a diferença. Com essa atitude, você contribui para que os materiais tenham o destino correto e possam ser reaproveitados com eficiência."
  },
  levar: {
    title: "Levar recicláveis até um ponto da PBLM",
    text: "Você pode dar o destino certo aos seus resíduos levando-os até um dos pontos de coleta da PBLM. Lá, eles serão tratados de forma adequada, entrando em um processo que transforma lixo em novos recursos e oportunidades sustentáveis."
  },
  compartilhar: {
    title: "Compartilhar informações",
    text: "Conscientizar também é um ato de cuidado com o planeta. Compartilhe conteúdos sobre reciclagem, sustentabilidade e as ações da PBLM com amigos, familiares e nas redes sociais. Espalhar conhecimento ajuda a multiplicar o impacto positivo."
  },
  participar: {
    title: "Participar de ações e projetos da PBLM",
    text: "A PBLM promove projetos ambientais, mutirões e campanhas educativas. Ao participar dessas iniciativas, você fortalece a corrente da transformação e se torna parte ativa da construção de um futuro mais limpo, justo e sustentável."
  }
};

function fadeContent(newTab) {
  // Remove any existing fade classes
  title.classList.remove('fade-in');
  text.classList.remove('fade-in');
  
  title.classList.add('fade-out');
  text.classList.add('fade-out');

  setTimeout(() => {
    // Update content
    title.textContent = contentMap[newTab].title;
    text.textContent = contentMap[newTab].text;

    // Trigger fade-in
    title.classList.remove('fade-out');
    text.classList.remove('fade-out');

    title.classList.add('fade-in');
    text.classList.add('fade-in');
  }, 300); // same duration as CSS transition
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('active')) return;

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const selected = tab.dataset.tab;
    fadeContent(selected);
  });
});

// ============================= SECTION 5 =========================================================
const sendBtn = document.querySelector('.section5-send-btn');
const textarea = document.querySelector('.section5-textarea');

// Coloque seu número no formato internacional sem espaços ou símbolos: ex: 5511999999999
const phoneNumber = '5544997200148';

sendBtn.addEventListener('click', () => {
  const message = encodeURIComponent(textarea.value.trim());
  if (!message) {
    alert('Por favor, digite uma mensagem antes de enviar.');
    return;
  }

  // Link do WhatsApp com mensagem pronta
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  window.open(url, '_blank');
});

//===============================BOTÃO TOPO==============================================
