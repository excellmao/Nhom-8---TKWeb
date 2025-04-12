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
      nextBtn.textContent = 'Submit';
      nextBtn.onclick = submitAnswers;
    } else {
      nextBtn.textContent = 'Next';
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
  
    document.getElementById('personality-type').textContent = `Bạn là: ${type}`;
    document.getElementById('personality-description').textContent = getDescription(type);
  
    // 🔥 Hide everything (except header) and show only results
    document.getElementById('main-content').style.display = 'none'; // hide all content
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('results').style.display = 'block'; // ensure results is visible
  }
  

  function calculateScores() {
    const scores = { 'e-value': 0, 's-value': 0, 't-value': 0, 'j-value': 0 };

    questions.forEach(q => {
      const category = q.dataset.category;
      const selected = q.querySelector('input[type="radio"]:checked');
      if (selected && category) {
        switch (selected.className) {
          case 'bigYes': scores[category] += 3; break;
          case 'yes': scores[category] += 2; break;
          case 'smallYes': scores[category] += 1; break;
          case 'mid': break;
          case 'smallNo': scores[category] -= 1; break;
          case 'no': scores[category] -= 2; break;
          case 'bigNo': scores[category] -= 3; break;
        }
      }
    });

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

  function getDescription(type) {
    const descriptions = {
      'INTJ': 'Chiến lược gia – sáng tạo, quyết đoán, có tầm nhìn.',
      'INFP': 'Người lý tưởng – nhạy cảm, trung thành, và đầy mộng mơ.',
      'ESFP': 'Người trình diễn – vui vẻ, ấm áp và sống hết mình.',
      'ENTP': 'Người tranh luận – thông minh, nhanh nhạy, sáng tạo.',
      // Add all 16 MBTI descriptions here...
    };
    return descriptions[type] || 'Bạn sở hữu một sự kết hợp đặc biệt giữa các đặc điểm tính cách!';
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
