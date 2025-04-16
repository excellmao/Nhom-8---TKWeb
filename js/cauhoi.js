let currentCategoryIndex = 0; // Start with the first category
const categories = ['e-value', 's-value', 't-value', 'j-value']; // Define categories
const questions = document.querySelectorAll('.question-container'); // Get all questions
const scores = { 'e-value': 0, 's-value': 0, 't-value': 0, 'j-value': 0 }; // Initialize scores for each category
const selectedAnswers = {}; // Store selected answers for each question

function showCategory(category) {
  // Hide all questions
  questions.forEach(question => {
    question.style.display = 'none';
  });

  // Show questions for the current category
  let firstQuestion = null;
  questions.forEach(question => {
    if (question.dataset.category === category) {
      question.style.display = 'block';
      if (!firstQuestion) {
        firstQuestion = question; // Save the first question in the category
      }
    }
  });

  // Scroll to the first question smoothly
  if (firstQuestion) {
    firstQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Update the button text
  const nextButton = document.getElementById('next');
  if (currentCategoryIndex === categories.length - 1) {
    nextButton.textContent = 'Submit'; // Change "Next" to "Submit" on the last category
    nextButton.dataset.action = 'submit'; // Add a custom data attribute to indicate submission
  } else {
    nextButton.textContent = 'Next';
    nextButton.dataset.action = 'next'; // Add a custom data attribute to indicate navigation
  }

  // Validate the category to enable/disable the button
  validateCategory();
}

function calculatePoints() {
  // Calculate points for the current category
  const currentCategory = categories[currentCategoryIndex];
  const currentQuestions = document.querySelectorAll(
    `.question-container[data-category="${currentCategory}"]`
  );

  // Reset the score for the current category
  scores[currentCategory] = 0;

  currentQuestions.forEach((question, index) => {
    const selectedOption = question.querySelector('input[type="radio"]:checked');
    const questionId = question.querySelector('input[type="radio"]').name;

    if (selectedOption) {
      const value = parseInt(selectedOption.value, 10);

      // Update the selected answer for this question
      selectedAnswers[questionId] = value; // Save the new answer

      // Add the value to the score
      scores[currentCategory] += value;

      // Log the result for each question
      console.log(`Category: ${currentCategory}, Question ${index + 1}, Selected Value: ${value}`);
    } else {
      console.log(`Category: ${currentCategory}, Question ${index + 1}, No option selected`);
    }
  });
}

function determineMBTI() {
  // Determine each letter in the MBTI type
  const eOrI = scores['e-value'] >= 0 ? 'E' : 'I';
  const sOrN = scores['s-value'] >= 0 ? 'S' : 'N';
  const tOrF = scores['t-value'] >= 0 ? 'T' : 'F';
  const jOrP = scores['j-value'] >= 0 ? 'J' : 'P';

  // Combine the letters to form the MBTI type
  return `${eOrI}${sOrN}${tOrF}${jOrP}`;
}

function submitTest() {
  calculatePoints(); // Calculate points for the last category

  // Determine the MBTI type
  const mbtiType = determineMBTI();

  // Log the final scores for each category
  console.log('Final Scores:', scores);
  console.log('Your MBTI Type:', mbtiType);

  // Load and display the MBTI description
  loadMBTIDescription(mbtiType); // Call the function to load the description

  // Hide the questionnaire and navigation buttons
  document.querySelector('.questionnaire').style.display = 'none';
  document.querySelector('.navigation').style.display = 'none';

  // Show the results section
  document.getElementById('results').classList.remove('hidden');
}

function validateCategory() {
  // Validate that all questions in the current category are answered
  const currentCategory = categories[currentCategoryIndex];
  const currentQuestions = document.querySelectorAll(
    `.question-container[data-category="${currentCategory}"]`
  );

  let allAnswered = true; // Flag to track if all questions are answered
  currentQuestions.forEach(question => {
    const selectedOption = question.querySelector('input[type="radio"]:checked');
    if (!selectedOption) {
      allAnswered = false; // If any question is unanswered, set the flag to false
    }
  });

  // Enable or disable the "Next" or "Submit" button
  const nextButton = document.getElementById('next');
  nextButton.disabled = !allAnswered; // Disable if not all questions are answered
}

function handleNextButtonClick(event) {
  event.preventDefault(); // Prevent default button behavior

  const nextButton = document.getElementById('next');
  const action = nextButton.dataset.action;

  if (action === 'next') {
    calculatePoints(); // Calculate points for the current category

    if (currentCategoryIndex < categories.length - 1) {
      currentCategoryIndex++;
      showCategory(categories[currentCategoryIndex]);
    }
  } else if (action === 'submit') {
    submitTest(); // Submit the test and show results
  }
}

function showPrevCategory(event) {
  event.preventDefault(); // Prevent default button behavior

  // Save the current selections before navigating back
  calculatePoints();

  if (currentCategoryIndex > 0) {
    currentCategoryIndex--;
    showCategory(categories[currentCategoryIndex]);
  }
}

// Add event listeners to validate the category whenever an option is selected
document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', validateCategory);
});

// Initialize the first category
showCategory(categories[currentCategoryIndex]);

// Add event listeners for navigation buttons
document.getElementById('prev').addEventListener('click', showPrevCategory);
document.getElementById('next').addEventListener('click', handleNextButtonClick);

// Function to load MBTI descriptions
async function loadMBTIDescription(type) {
  try {
    // Fetch the JSON file
    const response = await fetch('/json/MBTI.json');
    const data = await response.json();

    // Get the description for the selected type
    const mbti = data[type];

    // Update the HTML content
    if (mbti) {
      document.getElementById('personality-title').textContent = `${type} - ${mbti.title}`; // Include the MBTI type
      document.getElementById('personality-description').textContent = mbti.description;
    } else {
      document.getElementById('personality-title').textContent = "Không tìm thấy kết quả";
      document.getElementById('personality-description').textContent = "";
    }
  } catch (error) {
    console.error('Error loading MBTI descriptions:', error);
  }
}