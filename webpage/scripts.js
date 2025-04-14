document.addEventListener('DOMContentLoaded', function () {
  let currentQuestion = 0;
  const questions = Array.from(document.querySelectorAll('.question'));
  const selectedAnswers = {};

  function showQuestion(index) {
    questions.forEach((q, i) => {
      q.style.display = i === index ? 'block' : 'none';
    });

    document.getElementById('prev').disabled = index === 0;

    const nextBtn = document.getElementById('next');
    if (index === questions.length - 1) {
      nextBtn.textContent = 'Gửi kết quả 👌';
      nextBtn.onclick = submitAnswers;
    } else {
      nextBtn.textContent = 'Tiếp theo →';
      nextBtn.onclick = showNext;
    }

    restoreSelectedAnswer(index);
    toggleNextButton();
  }

  function showNext() {
    const currentOptions = questions[currentQuestion].querySelectorAll('input[type="radio"]');
    const selectedOption = Array.from(currentOptions).find(opt => opt.checked);

    if (!selectedOption) {
      alert('Vui lòng chọn một đáp án trước khi tiếp tục.');
      return;
    }

    saveSelectedAnswer(currentQuestion);
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      showQuestion(currentQuestion);
    }
  }

  function showPrev() {
    saveSelectedAnswer(currentQuestion);
    if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion(currentQuestion);
    }
  }

  function toggleNextButton() {
    const options = questions[currentQuestion].querySelectorAll('input[type="radio"]');
    const nextBtn = document.getElementById('next');
    const isSelected = Array.from(options).some(opt => opt.checked);
    nextBtn.disabled = !isSelected;
  }

  function saveSelectedAnswer(index) {
    const options = questions[index].querySelectorAll('input[type="radio"]');
    const selected = Array.from(options).find(opt => opt.checked);
    if (selected) {
      selectedAnswers[index] = selected.value;
    } else {
      delete selectedAnswers[index];
    }
  }

  function restoreSelectedAnswer(index) {
    const options = questions[index].querySelectorAll('input[type="radio"]');
    if (selectedAnswers[index]) {
      const toSelect = Array.from(options).find(opt => opt.value === selectedAnswers[index]);
      if (toSelect) toSelect.checked = true;
    }
  }

  function submitAnswers() {
    saveSelectedAnswer(currentQuestion);
    const scores = calculateScores();
    const type = getPersonalityType(scores);
  
    // Show the type
    document.getElementById('personality-type').textContent = `Bạn là: ${type}`;
  
    // Hide the quiz, show results container
    document.getElementById('main-content').style.display = 'none';
    const results = document.getElementById('results');
    results.classList.remove('hidden');
  
    // Hide all descriptions, then un-hide the one matching `type`
    document
      .querySelectorAll('#type-descriptions .type-description')
      .forEach(el => el.classList.add('hidden'));
  
    const match = document.querySelector(
      `#type-descriptions .type-description[data-type="${type}"]`
    );
    if (match) match.classList.remove('hidden');
  }
  
  

  function calculateScores() {
    const scores = { 'e-value': 0, 's-value': 0, 't-value': 0, 'j-value': 0 };
  
    questions.forEach((q, i) => {
      const category = q.dataset.category;
      const selected = q.querySelector('input[type="radio"]:checked');
  
      if (selected && category) {
        let value = 0;
  
        switch (selected.className) {
          case 'bigYes': value = 3; break;
          case 'yes': value = 2; break;
          case 'smallYes': value = 1; break;
          case 'mid': value = 0; break;
          case 'smallNo': value = -1; break;
          case 'no': value = -2; break;
          case 'bigNo': value = -3; break;
        }
  
        scores[category] += value;
  
        console.log(
          `Q${i + 1} (${category}): ${selected.value} [${selected.className}] → +${value} → total ${scores[category]}`
        );
      } else {
        console.log(`Q${i + 1} (${category}): no answer`);
      }
    });
  
    console.log('Final scores:', scores);
    return scores;
  }
  

  function getPersonalityType(scores) {
    let type = '';
    type += scores['e-value'] >= 0 ? 'E' : 'I';
    type += scores['s-value'] >= 0 ? 'S' : 'N';
    type += scores['t-value'] >= 0 ? 'T' : 'F';
    type += scores['j-value'] >= 0 ? 'J' : 'P';
    return type;
  }

  // Enable Next when answer is selected
  questions.forEach((q, i) => {
    const options = q.querySelectorAll('input[type="radio"]');
    options.forEach(opt => {
      opt.addEventListener('change', () => {
        if (i === currentQuestion) toggleNextButton();
      });
    });
  });

  // Init
  showQuestion(currentQuestion);
  document.getElementById('prev').addEventListener('click', showPrev);
});
