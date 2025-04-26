document.addEventListener('DOMContentLoaded',  function() {
  // Toggle dropdown menu
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const parent = this.parentElement;
      parent.classList.toggle('active');
    });
  });

  // Auto-expand dropdown if current page matches dropdown item
  const currentPath = window.location.hash;
  if (currentPath) {
    const activeDropdownItem = document.querySelector(`.dropdown-menu a[href="${currentPath}"]`);
    if (activeDropdownItem) {
      const parentDropdown = activeDropdownItem.closest('.has-dropdown');
      if (parentDropdown) {
        parentDropdown.classList.add('active');
      }
    }
  }

  // Add event listeners to type cards
  document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', function () {
      const typeId = this.id;
      console.log(`Card clicked: ${typeId}`); // Debugging line

      const typeLinks = {
        'INTJ': '/Nhom-8---TKWeb/lepersonalities/Architect/index.html',
        'INTP': '/Nhom-8---TKWeb/lepersonalities/Logician/logician.html',
        'ENTJ': '/Nhom-8---TKWeb/lepersonalities/Commander/commander.html',
        'ENTP': '/Nhom-8---TKWeb/lepersonalities/ENTP/debater.html',
        'INFJ': '/Nhom-8---TKWeb/lepersonalities/INFJ/INFJ.html',
        'INFP': '/Nhom-8---TKWeb/lepersonalities/INFP/INFP.html',
        'ENFJ': '/Nhom-8---TKWeb/lepersonalities/Protagonist/protagonist.html',
        'ENFP': '/Nhom-8---TKWeb/lepersonalities/Campaigner/Campaigner.html',
        'ISTJ': '/Nhom-8---TKWeb/lepersonalities/ISTJ/ISTJ.html',
        'ISFJ': '/Nhom-8---TKWeb/lepersonalities/ISFJ/ISFJ.html',
        'ESTJ': '/Nhom-8---TKWeb/lepersonalities/ESTJ/ESTJ.html',
        'ESFJ': '/Nhom-8---TKWeb/lepersonalities/ESFJ/ESFJ.html',
        'ISTP': '/Nhom-8---TKWeb/lepersonalities/ISTP/ISTP.html',
        'ISFP': '/Nhom-8---TKWeb/lepersonalities/ISFP/ISFP.html',
        'ESTP': '/Nhom-8---TKWeb/lepersonalities/ESTP/ESTP.html',
        'ESFP': '/Nhom-8---TKWeb/lepersonalities/ESFP/ESFP.html'
      };

      if (typeLinks[typeId]) {
        console.log(`Navigating to: ${typeLinks[typeId]}`); // Debugging line
        window.location.href = typeLinks[typeId];
      } else {
        console.error(`No URL found for type: ${typeId}`);
      }
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        
        // If it's a dropdown item, keep the dropdown open
        const parentDropdown = this.closest('.dropdown-menu');
        if (parentDropdown) {
          const parentLi = parentDropdown.closest('.has-dropdown');
          if (parentLi && !parentLi.classList.contains('active')) {
            parentLi.classList.add('active');
          }
        }
      }
    });
  });

  // Sticky navigation on scroll
  window.addEventListener('scroll', function() {
    const sidebar = document.querySelector('.sidebar-sticky');
    const header = document.querySelector('#main-header');
    if (sidebar && header) {
      const headerBottom = header.offsetTop + header.offsetHeight;
      
      if (window.pageYOffset > headerBottom - 100) {
        sidebar.classList.add('sticky');
      } else {
        sidebar.classList.remove('sticky');
      }
    }
  });

  // For type-detail.js functionality
  const loadTypeDetail = () => {
    const params = new URLSearchParams(window.location.search);
    const typeId = params.get('type');
    const typeName = params.get('name');
    
    if (typeId && typeName) {
      document.getElementById('type-title').textContent = typeName;
      document.getElementById('type-heading').textContent = `${typeName} Personality Type`;
      
      // Fill in the individual letters
      if (typeId.length === 4) {
        document.getElementById('letter1').textContent = typeId[0];
        document.getElementById('letter2').textContent = typeId[1];
        document.getElementById('letter3').textContent = typeId[2];
        document.getElementById('letter4').textContent = typeId[3];
        
        // Add letter explanations
        const explanations = {
          'I': 'Introversion: Prefers quiet reflection and draws energy from alone time',
          'E': 'Extraversion: Gains energy from social interaction and external engagement',
          'N': 'Intuition: Focuses on patterns, possibilities, and future implications',
          'S': 'Sensing: Attentive to concrete details and practical realities',
          'T': 'Thinking: Makes decisions based on logical analysis and objective criteria',
          'F': 'Feeling: Makes decisions based on values and considering impact on people',
          'J': 'Judging: Prefers structure, organization, and definitive decisions',
          'P': 'Perceiving: Favors flexibility, spontaneity, and keeping options open'
        };
        
        document.getElementById('letter1-exp').textContent = explanations[typeId[0]];
        document.getElementById('letter2-exp').textContent = explanations[typeId[1]];
        document.getElementById('letter3-exp').textContent = explanations[typeId[2]];
        document.getElementById('letter4-exp').textContent = explanations[typeId[3]];
      }
      
      fetchTypeDetails(typeId);
    }
  };

  // If on detail page, load the type details
  if (document.getElementById('type-detail-page')) {
    loadTypeDetail();
  }

  // Function to fetch type details
  function fetchTypeDetails(typeId) {
    // Map of type data
    const typeData = {
      'INTJ': {
        nickname: 'The Architect',
        image: 'https://images.unsplash.com/photo-1573511860302-28c524319d2a',
        summary: 'INTJs are analytical problem-solvers, eager to improve systems and processes with their innovative ideas. They have a talent for seeing possibilities for improvement, whether at work, at home, or in themselves.',
        strengths: ['Strategic and innovative thinking', 'Independent and decisive', 'Rational and objective', 'Determined and persistent', 'Intellectual curiosity'],
        challenges: ['Perfectionism', 'Difficulty expressing emotions', 'May come across as overly critical', 'Can be dismissive of others\' feelings', 'Sometimes judgmental'],
        careers: ['Scientists', 'Systems analysts', 'Engineers', 'Strategic planners', 'Entrepreneurs'],
        cognitive: {
          dominant: 'Introverted Intuition (Ni): Deep focus on possibilities and future outcomes',
          auxiliary: 'Extraverted Thinking (Te): Organizing and structuring the external world',
          tertiary: 'Introverted Feeling (Fi): Inner values system and emotional awareness',
          inferior: 'Extraverted Sensing (Se): In-the-moment engagement with the physical world'
        }
      },
      'INTP': {
        nickname: 'The Logician',
        image: 'https://images.unsplash.com/photo-1609074489183-e444f13c6707',
        summary: 'INTPs are innovative inventors with an unquenchable thirst for knowledge. They enjoy theoretical and abstract concepts and value intelligence and insight above all else.',
        strengths: ['Original and creative thinking', 'Logical and objective analysis', 'Open-minded exploration of ideas', 'Independent problem-solving', 'Adaptability to complexity'],
        challenges: ['May neglect practical matters', 'Can struggle with follow-through', 'Sometimes socially reserved', 'May overlook emotional considerations', 'Can become overly detached'],
        careers: ['Computer programmers', 'Philosophers', 'Scientists', 'Mathematicians', 'Systems analysts'],
        cognitive: {
          dominant: 'Introverted Thinking (Ti): Internal logical framework and analysis',
          auxiliary: 'Extraverted Intuition (Ne): Exploring possibilities and connections',
          tertiary: 'Introverted Sensing (Si): Memory and internal sensory experiences',
          inferior: 'Extraverted Feeling (Fe): Connecting with and understanding others\' emotions'
        }
      },
      'ENTJ': {
        nickname: 'The Commander',
        image: 'https://images.unsplash.com/photo-1522134239946-03d8c105a0ba',
        summary: 'ENTJs are strategic leaders, driven to implement their vision of what is best. They are quick to see inefficiency and conceptualize new solutions, valuing competence and decisive action.',
        strengths: ['Strategic vision and planning', 'Decisive leadership', 'Efficiency and organization', 'Direct communication', 'Self-confidence'],
        challenges: ['Can be overly dominant', 'Impatience with inefficiency', 'May neglect emotional factors', 'Sometimes intimidating to others', 'Can be inflexible'],
        careers: ['Corporate executives', 'Entrepreneurs', 'Lawyers', 'Management consultants', 'Military leaders'],
        cognitive: {
          dominant: 'Extraverted Thinking (Te): Organizing and structuring the external world',
          auxiliary: 'Introverted Intuition (Ni): Deep focus on possibilities and future outcomes',
          tertiary: 'Extraverted Sensing (Se): In-the-moment engagement with the physical world',
          inferior: 'Introverted Feeling (Fi): Inner values system and emotional awareness'
        }
      }
    };

    // Fill in details for other types by generating placeholder content
    const allTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
    const nicknames = {
      'ENTP': 'The Debater',
      'INFJ': 'The Advocate',
      'INFP': 'The Mediator',
      'ENFJ': 'The Protagonist',
      'ENFP': 'The Campaigner',
      'ISTJ': 'The Logistician',
      'ISFJ': 'The Defender',
      'ESTJ': 'The Executive',
      'ESFJ': 'The Consul',
      'ISTP': 'The Virtuoso',
      'ISFP': 'The Adventurer',
      'ESTP': 'The Entrepreneur',
      'ESFP': 'The Entertainer'
    };

    const images = [
      'https://images.unsplash.com/photo-1573511860302-28c524319d2a',
      'https://images.unsplash.com/photo-1609074489183-e444f13c6707',
      'https://images.unsplash.com/photo-1522134239946-03d8c105a0ba',
      'https://images.unsplash.com/photo-1674558342044-491a5f1edc5a'
    ];

    // Generate data for missing types
    allTypes.forEach((type, index) => {
      if (!typeData[type]) {
        typeData[type] = {
          nickname: nicknames[type],
          image: images[index % images.length],
          summary: `${type} individuals have unique and fascinating characteristics that influence how they interact with the world and others around them.`,
          strengths: ['Unique perspective', 'Special approach to problems', 'Valuable contributions to teams', 'Distinct communication style', 'Particular talents'],
          challenges: ['Specific growth areas', 'Potential blind spots', 'Particular stressors', 'Unique social challenges', 'Areas for development'],
          careers: ['Suitable professional path 1', 'Suitable professional path 2', 'Suitable professional path 3', 'Suitable professional path 4', 'Suitable professional path 5'],
          cognitive: {
            dominant: 'Primary cognitive function: How this type primarily processes information',
            auxiliary: 'Secondary cognitive function: Supporting mental process',
            tertiary: 'Tertiary cognitive function: Less developed but still accessible',
            inferior: 'Inferior cognitive function: Least developed and often challenging'
          }
        };
      }
    });

    const currentTypeData = typeData[typeId] || {
      nickname: 'Unknown Type',
      image: images[0],
      summary: 'Information about this personality type is currently being developed.',
      strengths: ['To be determined'],
      challenges: ['To be determined'],
      careers: ['To be determined'],
      cognitive: {
        dominant: 'Information unavailable',
        auxiliary: 'Information unavailable',
        tertiary: 'Information unavailable',
        inferior: 'Information unavailable'
      }
    };

    // Update the DOM with the type data
    document.getElementById('type-nickname').textContent = `- ${currentTypeData.nickname}`;
    document.getElementById('type-banner').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${currentTypeData.image}')`;
    document.getElementById('type-summary').textContent = currentTypeData.summary;

    // Update strengths
    const strengthsList = document.getElementById('strengths-list');
    strengthsList.innerHTML = '';
    currentTypeData.strengths.forEach(strength => {
      const li = document.createElement('li');
      li.textContent = strength;
      strengthsList.appendChild(li);
    });

    // Update challenges
    const challengesList = document.getElementById('challenges-list');
    challengesList.innerHTML = '';
    currentTypeData.challenges.forEach(challenge => {
      const li = document.createElement('li');
      li.textContent = challenge;
      challengesList.appendChild(li);
    });

    // Update careers
    const careersList = document.getElementById('careers-list');
    careersList.innerHTML = '';
    currentTypeData.careers.forEach(career => {
      const li = document.createElement('li');
      li.textContent = career;
      careersList.appendChild(li);
    });

    // Update cognitive functions
    document.getElementById('dominant-function').textContent = currentTypeData.cognitive.dominant;
    document.getElementById('auxiliary-function').textContent = currentTypeData.cognitive.auxiliary;
    document.getElementById('tertiary-function').textContent = currentTypeData.cognitive.tertiary;
    document.getElementById('inferior-function').textContent = currentTypeData.cognitive.inferior;
  }
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
  
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight; // Get header height
        const targetPosition = targetElement.offsetTop - headerHeight; // Adjust scroll position
  
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
 
