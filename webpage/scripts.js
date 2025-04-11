let currentQuestion = 0;
const questions = document.querySelectorAll('.question');
const selectedAnswers = {}; // Object to store selected answers

function showQuestion(index) {
  questions.forEach((q, i) => {
    q.style.display = i === index ? 'block' : 'none'; // Ensure only the current question is visible
  });

  // Disable Prev button on the first question
  document.getElementById('prev').disabled = index === 0;

  // Change Next button to "Submit" on the last question
  const nextBtn = document.getElementById('next');
  if (index === questions.length - 1) {
    nextBtn.textContent = 'Submit';
    nextBtn.onclick = submitAnswers;
  } else {
    nextBtn.textContent = 'Next';
    nextBtn.onclick = showNext;
  }

  // Restore the previously selected answer for the current question
  restoreSelectedAnswer(index);

  // Check if the current question has an option selected
  toggleNextButton();
}

function showNext() {
  const currentOptions = questions[currentQuestion].querySelectorAll('input[type="radio"]');
  const selectedOption = Array.from(currentOptions).find(option => option.checked);

  if (!selectedOption) {
    alert('Please select an option before proceeding to the next question.');
    return; // Prevent moving to the next question if no option is selected
  }

  saveSelectedAnswer(currentQuestion); // Save the selected answer before moving to the next question
  if (currentQuestion < questions.length - 1) {
    currentQuestion = currentQuestion + 1;
    showQuestion(currentQuestion);
  }
}

function showPrev() {
  saveSelectedAnswer(currentQuestion); // Save the selected answer for the current question
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
}

function submitAnswers() {
  saveSelectedAnswer(currentQuestion); // Save the last question's answer
  const scores = calculateScores();
  alert(`Scores: ${JSON.stringify(scores)}`);
  // Add form submission logic here
}

function toggleNextButton() {
  const currentOptions = questions[currentQuestion].querySelectorAll('input[type="radio"]');
  const nextBtn = document.getElementById('next');
  const isOptionSelected = Array.from(currentOptions).some(option => option.checked);

  nextBtn.disabled = !isOptionSelected; // Disable Next button if no option is selected
}

function saveSelectedAnswer(index) {
  const currentOptions = questions[index].querySelectorAll('input[type="radio"]');
  const selectedOption = Array.from(currentOptions).find(option => option.checked);
  if (selectedOption) {
    selectedAnswers[index] = selectedOption.value; // Save the selected value
  } else {
    delete selectedAnswers[index]; // Remove the entry if no option is selected
  }
  console.log('Saved answers:', selectedAnswers); // Debugging log
}

function restoreSelectedAnswer(index) {
  const currentOptions = questions[index].querySelectorAll('input[type="radio"]');
  if (selectedAnswers[index]) {
    const optionToSelect = Array.from(currentOptions).find(option => option.value === selectedAnswers[index]);
    if (optionToSelect) {
      optionToSelect.checked = true; // Restore the previously selected value
    }
  }
  console.log('Restored answers for question', index, selectedAnswers[index]); // Debugging log
}

function calculateScores() {
  const categories = ['e-value', 's-value', 't-value', 'j-value'];
  const scores = {};

  categories.forEach(category => {
    scores[category] = 0; // Initialize score for each category
    const questions = document.querySelectorAll(`.${category} .question`);

    questions.forEach(question => {
      const selectedOption = question.querySelector('input[type="radio"]:checked');
      if (selectedOption) {
        switch (selectedOption.className) {
          case 'bigYes':
            scores[category] += 3;
            break;
          case 'yes':
            scores[category] += 2;
            break;
          case 'smallYes':
            scores[category] += 1;
            break;
          case 'mid':
            scores[category] += 0;
            break;
          case 'smallNo':
            scores[category] -= 1;
            break;
          case 'no':
            scores[category] -= 2;
            break;
          case 'bigNo':
            scores[category] -= 3;
            break;
        }
      }
    });
  });

  console.log(scores); // Debugging log
  return scores;
}

// Add event listeners to all radio buttons to enable the Next button when an option is selected
questions.forEach((question, index) => {
  const options = question.querySelectorAll('input[type="radio"]');
  options.forEach(option => {
    option.addEventListener('change', () => {
      if (index === currentQuestion) {
        toggleNextButton();
      }
    });
  });
});

// Initialize first question
showQuestion(currentQuestion);

// Add event listeners for navigation buttons
document.getElementById('prev').addEventListener('click', showPrev);
document.getElementById('next').addEventListener('click', () => {
  if (document.getElementById('next').textContent === 'Submit') {
    submitAnswers();
  } else {
    showNext();
  }
});