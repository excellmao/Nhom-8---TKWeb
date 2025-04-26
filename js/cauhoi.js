let currentCategoryIndex = 0; // Start with the first category
const categories = ['e-value', 's-value', 't-value', 'j-value']; // Define categories
const questions = document.querySelectorAll('.question-container'); // Get all questions
const scores = { 'e-value': 0, 's-value': 0, 't-value': 0, 'j-value': 0 }; // Initialize scores for each category
const selectedAnswers = {}; // Store selected answers for each question
let initialLoad = true;

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
  if (firstQuestion && !initialLoad) {
    const yOffset = -80;
    const y = firstQuestion.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
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
  if (firstQuestion && !initialLoad) {
    firstQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  initialLoad = false; // Set initialLoad to false after the first category is shown
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

  // Hide the hero section
  const heroSection = document.querySelector('.hero'); // Adjust the selector if needed
  if (heroSection) {
      heroSection.style.display = 'none';
  }

  // Show the results section
  document.getElementById('results').classList.remove('hidden');
  updateCategoryProgressBars();
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

  // Enable or disable the "Previous" button
  const prevButton = document.getElementById('prev');
  prevButton.disabled = currentCategoryIndex === 0; // Disable if on the first category
}

function scrollToFirstVisibleQuestion() {
  const currentCategory = categories[currentCategoryIndex];
  const firstQuestion = document.querySelector(
    `.question-container[data-category="${currentCategory}"]`
  );

  if (firstQuestion) {
    const yOffset = -90; // Adjust based on your header height
    const y = firstQuestion.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function handleNextButtonClick(event) {
  event.preventDefault();
  calculatePoints();
  if (currentCategoryIndex < categories.length - 1) {
    currentCategoryIndex++;
    showCategory(categories[currentCategoryIndex]);
    scrollToFirstVisibleQuestion();
  } else {
    submitTest();
  }
}

function showPrevCategory(event) {
  event.preventDefault();
  calculatePoints();
  if (currentCategoryIndex > 0) {
    currentCategoryIndex--;
    showCategory(categories[currentCategoryIndex]);
    scrollToFirstVisibleQuestion();
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

// Run initial validation after DOM setup
validateCategory();

// Function to load MBTI descriptions
async function loadMBTIDescription(type) {
  try {
    // Fetch the JSON file
    const response = await fetch('/Nhom-8---TKWeb/json/MBTI.json');
    const data = await response.json();

    // Get the description for the selected type
    const mbti = data[type];

    // Update the HTML content
    if (mbti) {
      // Update the MBTI result with the type and title
      const mbtiResultElement = document.querySelector('.mbti-result');
      if (mbtiResultElement) {
        mbtiResultElement.textContent = `${type} - ${mbti.title}`;
      }

      // Update the description
      const descriptionElement = document.querySelector('.description');
      if (descriptionElement) {
        descriptionElement.textContent = mbti.description;
      }

      // Update the result image
      const resultImage = document.querySelector('.result-image img');
      if (resultImage) {
        resultImage.src = mbti.image; // Set the image source from the JSON
        resultImage.alt = `${type} Image`;
      }

      // Update the "Tìm hiểu thêm" button
      const learnMoreButton = document.getElementById('learn-more');
      if (learnMoreButton) {
        learnMoreButton.href = mbti.link; // Set the link from the JSON
        learnMoreButton.style.display = 'inline-block'; // Make the button visible
      }
    } else {
      // Handle case where MBTI type is not found
      const mbtiResultElement = document.querySelector('.mbti-result');
      if (mbtiResultElement) {
        mbtiResultElement.textContent = "Không tìm thấy kết quả";
      }

      const descriptionElement = document.querySelector('.description');
      if (descriptionElement) {
        descriptionElement.textContent = "Không có thông tin mô tả cho loại tính cách này.";
      }

      // Hide the result image
      const resultImage = document.querySelector('.result-image img');
      if (resultImage) {
        resultImage.src = '';
        resultImage.alt = '';
      }

      // Hide the "Tìm hiểu thêm" button
      const learnMoreButton = document.getElementById('learn-more');
      if (learnMoreButton) {
        learnMoreButton.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error loading MBTI descriptions:', error);
  }
}

window.history.pushState({}, document.title, window.location.pathname);

function calculateCategoryPoints() {
  const categories = ['e-value', 's-value', 't-value', 'j-value'];
  const categoryPoints = {};

  categories.forEach((category) => {
    categoryPoints[category] = 0;

    // Get all selected radio buttons for the category
    const selectedRadios = document.querySelectorAll(
      `.question-container[data-category="${category}"] input[type="radio"]:checked`
    );

    // Sum up the values for the category
    selectedRadios.forEach((radio) => {
      categoryPoints[category] += parseInt(radio.value, 10);
    });
  });

  return categoryPoints;
}

// Function to update progress bars
function updateCategoryProgressBars() {
  const categoryPoints = calculateCategoryPoints();

  Object.keys(categoryPoints).forEach((category) => {
    const progressBarFill = document.querySelector(
      `.progress-bar-container[data-category="${category}"] .progress-bar-fill`
    );

    // Map points (-30 to 30) to percentage (0% to 100%)
    const percentage = ((categoryPoints[category] + 30) / 60) * 100;

    // Update the width of the progress bar fill
    progressBarFill.style.width = `${percentage}%`;

    // Change the color based on positive or negative points
    if (categoryPoints[category] < 0) {
      progressBarFill.style.backgroundColor = '#f44336'; // Red for negative points
    } else {
      progressBarFill.style.backgroundColor = '#4caf50'; // Green for positive points
    }
  });
}

// Call the update function when showing results
document.addEventListener('DOMContentLoaded', () => {
  const resultsSection = document.getElementById('results');
  if (resultsSection) {
    updateCategoryProgressBars();
  }
});