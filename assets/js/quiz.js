(async () => {
  const { $, escapeHTML } = window.DMC;
  const container = $('#quizCard');

  const QUESTIONS_PER_RUN = 15;

  let questions = [];
  let list = [];
  let index = 0;
  let score = 0;
  let locked = false;

  /* =========================================================
     SHUFFLE FUNCTION
     Randomizes questions and answer choices
     ========================================================= */
  const shuffle = (items) => {
    const arr = [...items];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  };


  /* =========================================================
     RESULT RANK
     ========================================================= */
  const rankFor = (pct) =>
    pct >= 93 ? 'SSS' :
    pct >= 80 ? 'S' :
    pct >= 67 ? 'A' :
    pct >= 53 ? 'B' :
    pct >= 40 ? 'C' : 'D';


  /* =========================================================
     START / RESTART QUIZ
     ========================================================= */
  const start = () => {

    /*
      Shuffle all questions.

      If you later add more than 30 questions to data.json,
      this will randomly choose 30 questions from the bank.
    */
    list = shuffle(questions).slice(
      0,
      Math.min(QUESTIONS_PER_RUN, questions.length)
    );

    index = 0;
    score = 0;
    locked = false;

    render();
  };


  /* =========================================================
     RENDER QUIZ
     ========================================================= */
  const render = () => {

    /* Quiz finished */
    if (index >= list.length) {

      const pct = Math.round(
        (score / list.length) * 100
      );

      container.innerHTML = `
        <div style="text-align:center">

          <span class="section-kicker">
            Mission complete
          </span>

          <div class="result-rank">
            ${rankFor(pct)}
          </div>

          <h2 class="quiz-question">
            ${score} / ${list.length} correct
          </h2>

          <p
            style="
              color:var(--muted);
              margin:.8rem auto 1.4rem;
              max-width:520px;
            "
          >
            Your style score is ${pct}%.
            Replay to reshuffle the questions
            and every answer choice.
          </p>

          <button
            class="btn"
            id="restartQuiz"
          >
            Run it back
            <i class="fa-solid fa-rotate-right"></i>
          </button>

        </div>
      `;

      $('#restartQuiz').addEventListener(
        'click',
        start
      );

      return;
    }


    locked = false;

    const item = list[index];

    /*
      Shuffle answers every time
      a question appears.
    */
    const options = shuffle(item.c);


    container.innerHTML = `

      <div class="quiz-top">

        <span>
          Question ${index + 1} / ${list.length}
        </span>

        <strong>
          Score ${score}
        </strong>

      </div>


      <div class="quiz-progress">

        <span
          style="
            --progress:
            ${((index + 1) / list.length) * 100}%
          "
        ></span>

      </div>


      <h2 class="quiz-question">
        ${escapeHTML(item.q)}
      </h2>


      <div class="quiz-choices">

        ${options.map(
          (option, optionIndex) => `

            <button
              class="choice-btn"
              data-option-index="${optionIndex}"
            >
              ${escapeHTML(option)}
            </button>

          `
        ).join('')}

      </div>


      <div class="quiz-actions">

        <button
          class="btn small"
          id="nextQuestion"
          disabled
        >
          Next question
          <i class="fa-solid fa-arrow-right"></i>
        </button>

      </div>
    `;


    const buttons = [
      ...container.querySelectorAll(
        '.choice-btn'
      )
    ];


    /* =====================================================
       ANSWER CLICK
       ===================================================== */
    buttons.forEach(
      (button, optionIndex) => {

        button.addEventListener(
          'click',
          () => {

            if (locked) return;

            locked = true;


            const selected =
              options[optionIndex];


            /* Add score if correct */
            if (selected === item.a) {
              score++;
            }


            /*
              Show correct / incorrect answer
            */
            buttons.forEach(
              (btn, btnIndex) => {

                btn.disabled = true;

                const value =
                  options[btnIndex];


                if (value === item.a) {

                  btn.classList.add(
                    'correct'
                  );

                }

                else if (btn === button) {

                  btn.classList.add(
                    'incorrect'
                  );

                }

              }
            );


            /* Enable next button */
            const next =
              $('#nextQuestion');

            next.disabled = false;

            next.focus();

          }
        );

      }
    );


    /* =====================================================
       NEXT QUESTION
       ===================================================== */
    $('#nextQuestion').addEventListener(
      'click',
      () => {

        index++;

        render();

      }
    );

  };


  /* =========================================================
     LOAD QUIZ QUESTIONS FROM data.json
     ========================================================= */
  try {

    container.innerHTML = `

      <div
        style="
          text-align:center;
          padding:2rem 1rem;
        "
      >

        <span class="section-kicker">
          Loading mission data
        </span>

        <p style="color:var(--muted)">
          Preparing the question bank...
        </p>

      </div>
    `;


    const response =
      await fetch(
        'assets/js/data.json'
      );


    if (!response.ok) {

      throw new Error(
        'Unable to load quiz data.'
      );

    }


    const data =
      await response.json();


    if (
      !Array.isArray(data.quiz) ||
      data.quiz.length === 0
    ) {

      throw new Error(
        'No quiz questions were found in data.json.'
      );

    }


    questions = data.quiz;

    start();


  } catch (error) {

    container.innerHTML = `

      <div class="notice">

        ${escapeHTML(error.message)}

        Run the website through
        Live Server or your hosted site
        so data.json can load correctly.

      </div>

    `;

  }

})();