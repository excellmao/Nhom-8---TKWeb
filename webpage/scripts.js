let currentQuestion = 0;
const questions = document.querySelectorAll('.question');

function showQuestion(index) {
  questions.forEach((q, i) => {
    q.style.display = i === index ? 'block' : 'none';
  });

  // Disable Prev button on first question
  document.getElementById('prev').disabled = index === 0;

  // Change Next button to "Submit" on last question
  const nextBtn = document.getElementById('next');
  if (index === questions.length - 1) {
    nextBtn.textContent = 'Submit';
    nextBtn.onclick = submitAnswers;
  } else {
    nextBtn.textContent = 'Next';
    nextBtn.onclick = showNext;
  }
}

function showNext() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion(currentQuestion);
  }
}

function showPrev() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
}

function submitAnswers() {
  alert('Submitting your answers...');
  // Add form submission logic here
}

// Initialize first question
showQuestion(currentQuestion);
