// Skill dot fill állapot (mert a --level vs --i összevetés CSS-ben nem megbízható)
document.querySelectorAll('.skill-row').forEach(row => {
  const level = parseInt(getComputedStyle(row).getPropertyValue('--level')) || 0;
  row.querySelectorAll('.skill-dot').forEach(dot => {
    const i = parseInt(getComputedStyle(dot).getPropertyValue('--i'));
    if (i < level) dot.classList.add('filled');
    if (i === level - 1) dot.classList.add('active');
  });
});

// Feltöltődés animálása, amikor a szekció scrollra bekerül a képbe
const skillsSection = document.getElementById('skillsSection');
if (skillsSection) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillsSection.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  io.observe(skillsSection);
}

const animatedHeadings = document.querySelectorAll('.section-heading-row');
if (animatedHeadings.length) {
  const headingObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  animatedHeadings.forEach(heading => headingObserver.observe(heading));
}

const popupOverlay = document.createElement('div');
popupOverlay.className = 'skill-popup-overlay';
popupOverlay.innerHTML = `
  <div class="skill-popup" role="dialog" aria-modal="true">
    <div class="skill-popup-head">
      <div class="skill-popup-badge">
        <span class="skill-popup-ring"></span>
        <span class="skill-popup-orb"></span>
      </div>
      <span class="skill-popup-kicker">Insight</span>
      <button class="skill-popup-close" type="button" aria-label="Bezárás">✕</button>
    </div>
    <div class="skill-popup-body typewriter"></div>
  </div>
`;
document.body.appendChild(popupOverlay);

const popupBody = popupOverlay.querySelector('.skill-popup-body');
const popupClose = popupOverlay.querySelector('.skill-popup-close');
const popupTypingDelay = 4; // gyorsabb, mint a hero (10ms)
let popupTypeTimer = null;

function stopPopupTyping(){
  if (popupTypeTimer) clearTimeout(popupTypeTimer);
  popupTypeTimer = null;
}

function typePopupText(text){
  stopPopupTyping();
  popupBody.classList.remove('done');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animOff = document.body.classList.contains('animations-disabled');

  if (reduced || animOff) {
    popupBody.textContent = text;
    popupBody.classList.add('done');
    return;
  }

  let i = 0;
  popupBody.textContent = '';
  function step(){
    if (i <= text.length) {
      popupBody.textContent = text.slice(0, i);
      i += 1;
      popupTypeTimer = setTimeout(step, popupTypingDelay);
    } else {
      popupBody.classList.add('done');
    }
  }
  step();
}

function openSkillPopup(templateId){
  const tpl = document.getElementById(templateId);
  if (!tpl) return;
  const paragraphs = Array.from(tpl.content.querySelectorAll('p')).map(p => p.textContent.trim());
  const text = paragraphs.join('\n\n');
  popupOverlay.classList.add('open');
  typePopupText(text);
}

function closeSkillPopup(){
  popupOverlay.classList.remove('open');
  stopPopupTyping();
}

document.querySelectorAll('.skill-info').forEach(btn => {
  btn.addEventListener('click', () => openSkillPopup(btn.dataset.infoTarget));
});

popupClose.addEventListener('click', closeSkillPopup);
popupOverlay.addEventListener('click', (e) => {
  if (e.target === popupOverlay) closeSkillPopup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSkillPopup();
});