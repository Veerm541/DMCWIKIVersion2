(() => {
  const { $, escapeHTML } = window.DMC;
  const questions = [
    { q: "What is the name of Dante's signature handgun?", c: ["Ivory", "Ebony", "Ebony & Ivory", "Sparda's Pistols"], a: "Ebony & Ivory" },
    { q: "Which game first introduced Nero as a playable character?", c: ["Devil May Cry 1", "Devil May Cry 3", "Devil May Cry 4", "Devil May Cry 5"], a: "Devil May Cry 4" },
    { q: "What is the name of Dante's demonic father?", c: ["Mundus", "Vergil", "Sparda", "Argosax"], a: "Sparda" },
    { q: "What is the name of the demonic tree that Urizen seeks to cultivate in Devil May Cry 5?", c: ["Yggdrasil", "Qliphoth", "Tree of Souls", "Demon's Root"], a: "Qliphoth" },
    { q: "What is the name of the demon emperor in DMC1?", c: ["Mundus", "Vergil", "Arkham", "Arius"], a: "Mundus" },
    { q: "What is the name of Nero's demonic arm introduced in Devil May Cry 4?", c: ["Devil Bringer", "Devil Breaker", "Demon's Grasp", "Yamato"], a: "Devil Bringer" },
    { q: "What was the original purpose of Trish's creation?", c: ["To serve as a vessel for Eva's soul", "To lure Dante into a trap", "To be a guardian of the Temen-ni-gru", "To act as a spy for the Order of the Sword"], a: "To lure Dante into a trap" },
    { q: "Which character says 'Jackpot!' as their catchphrase?", c: ["Nero", "Vergil", "Dante", "Lady"], a: "Dante" },
    { q: "What is the name of Dante's shop?", c: ["Devil Hunter", "Demon's Cry", "Devil May Cry", "Son of Sparda"], a: "Devil May Cry" },
    { q: "Which game features the Temen-ni-gru tower?", c: ["DMC1", "DMC3", "DMC4", "DMC5"], a: "DMC3" },
    { q: "What is Vergil's signature weapon?", c: ["Yamato", "Rebellion", "Force Edge", "Red Queen"], a: "Yamato" },
    { q: "Which character is NOT playable in DMC5?", c: ["Dante", "Nero", "V", "Lady"], a: "Lady" },
    { q: "What is the name of the demon king that Nero and V must confront in Devil May Cry 5?", c: ["Urizen", "Mundus", "Sparda", "Vergil"], a: "Urizen" },
    { q: "Which game is chronologically first in the timeline? (Hint: When Dante was young)", c: ["DMC1", "DMC3", "DMC4", "DMC5"], a: "DMC3" },
    { q: "What is the name of Nero's sword in DMC4 and DMC5?", c: ["Red Queen", "Blue Rose", "Yamato", "Rebellion"], a: "Red Queen" }
  ];

  const container = $('#quizCard');
  let list = [], index = 0, score = 0, locked = false;
  const shuffle = arr => [...arr].sort(() => Math.random() - .5);
  const rankFor = pct => pct >= 93 ? 'SSS' : pct >= 80 ? 'S' : pct >= 67 ? 'A' : pct >= 53 ? 'B' : pct >= 40 ? 'C' : 'D';

  const start = () => { list = shuffle(questions); index = 0; score = 0; locked = false; render(); };
  const render = () => {
    if (index >= list.length) {
      const pct = Math.round((score / list.length) * 100);
      container.innerHTML = `<div style="text-align:center"><span class="section-kicker">Mission complete</span><div class="result-rank">${rankFor(pct)}</div><h2 class="quiz-question">${score} / ${list.length} correct</h2><p style="color:var(--muted);margin:.8rem auto 1.4rem;max-width:520px">Your style score is ${pct}%. Replay to reshuffle every question and answer choice.</p><button class="btn" id="restartQuiz">Run it back <i class="fa-solid fa-rotate-right"></i></button></div>`;
      $('#restartQuiz').addEventListener('click', start);
      return;
    }
    locked = false;
    const item = list[index];
    const options = shuffle(item.c);
    container.innerHTML = `
      <div class="quiz-top"><span>Question ${index + 1} / ${list.length}</span><strong>Score ${score}</strong></div>
      <div class="quiz-progress"><span style="--progress:${((index + 1) / list.length) * 100}%"></span></div>
      <h2 class="quiz-question">${escapeHTML(item.q)}</h2>
      <div class="quiz-choices">${options.map(option => `<button class="choice-btn" data-choice="${escapeHTML(option)}">${escapeHTML(option)}</button>`).join('')}</div>
      <div class="quiz-actions"><button class="btn small" id="nextQuestion" disabled>Next question <i class="fa-solid fa-arrow-right"></i></button></div>`;

    container.querySelectorAll('.choice-btn').forEach(button => button.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      const selected = button.dataset.choice;
      if (selected === item.a) score++;
      container.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.choice === item.a) btn.classList.add('correct');
        else if (btn === button) btn.classList.add('incorrect');
      });
      const next = $('#nextQuestion');
      next.disabled = false;
      next.focus();
    }));
    $('#nextQuestion').addEventListener('click', () => { index++; render(); });
  };
  start();
})();
