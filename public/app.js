const root = document.getElementById('root');

// Theme names for template system (no background overrides)
const themes = {
  sunset: 'sunset',
  ocean: 'ocean', 
  forest: 'forest',
  night: 'night',
  rose: 'rose'
};

let currentTheme = 'ocean';

function App() {
  const container = document.createElement('div');

  // Header
  const header = document.createElement('div');
  header.className = 'app-header';
  
  const h1 = document.createElement('h1');
  h1.textContent = '🎵 Instagram Song Translations';
  header.appendChild(h1);
  
  const subtitle = document.createElement('p');
  subtitle.textContent = 'Transform song lyrics into beautiful Italian translations for Instagram';
  header.appendChild(subtitle);
  
  container.appendChild(header);

  // Main content
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';

  // Input section
  const inputSection = document.createElement('div');
  inputSection.className = 'input-section';

  // Artist input
  const artistGroup = document.createElement('div');
  artistGroup.className = 'input-group';
  
  const artistLabel = document.createElement('label');
  artistLabel.textContent = 'Artist & Song Title';
  artistGroup.appendChild(artistLabel);
  
  const artistInput = document.createElement('input');
  artistInput.type = 'text';
  artistInput.className = 'artist-input';
  artistInput.placeholder = 'e.g., Taylor Swift - Anti-Hero';
  artistGroup.appendChild(artistInput);
  
  inputSection.appendChild(artistGroup);

  // Lyrics input
  const lyricsGroup = document.createElement('div');
  lyricsGroup.className = 'input-group';
  
  const lyricsLabel = document.createElement('label');
  lyricsLabel.textContent = 'Song Lyrics';
  lyricsGroup.appendChild(lyricsLabel);
  
  const textarea = document.createElement('textarea');
  textarea.className = 'song-input';
  textarea.placeholder = 'Paste the song lyrics here...';
  lyricsGroup.appendChild(textarea);
  
  inputSection.appendChild(lyricsGroup);

  // Theme selector
  const themeGroup = document.createElement('div');
  themeGroup.className = 'input-group theme-selector';
  
  const themeLabel = document.createElement('label');
  themeLabel.textContent = 'Choose Theme';
  themeGroup.appendChild(themeLabel);
  
  const themeOptions = document.createElement('div');
  themeOptions.className = 'theme-options';
  
  Object.keys(themes).forEach(themeName => {
    const themeOption = document.createElement('div');
    themeOption.className = `theme-option theme-${themeName}`;
    if (themeName === currentTheme) {
      themeOption.classList.add('active');
    }
    themeOption.onclick = () => selectTheme(themeName, themeOptions);
    themeOptions.appendChild(themeOption);
  });
  
  themeGroup.appendChild(themeOptions);
  inputSection.appendChild(themeGroup);

  // Buttons
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';
  
  const translateButton = document.createElement('button');
  translateButton.className = 'btn btn-primary';
  translateButton.textContent = 'Translate & Generate Posts';
  translateButton.onclick = () => handleTranslate(textarea.value, artistInput.value, translateButton);
  buttonGroup.appendChild(translateButton);

  const generateMetadataButton = document.createElement('button');
  generateMetadataButton.className = 'btn btn-secondary';
  generateMetadataButton.textContent = 'Generate Post Caption';
  generateMetadataButton.onclick = () => handleGenerateMetadata(textarea.value, artistInput.value, generateMetadataButton);
  buttonGroup.appendChild(generateMetadataButton);

  const downloadButton = document.createElement('button');
  downloadButton.className = 'btn btn-secondary';
  downloadButton.textContent = 'Download All Posts';
  downloadButton.onclick = Actions.download;
  buttonGroup.appendChild(downloadButton);

  const downloadZipButton = document.createElement('button');
  downloadZipButton.className = 'btn btn-secondary';
  downloadZipButton.textContent = 'Download as ZIP';
  downloadZipButton.onclick = () => handleDownloadZip(downloadZipButton);
  buttonGroup.appendChild(downloadZipButton);
  
  inputSection.appendChild(buttonGroup);
  mainContent.appendChild(inputSection);

  // Post preview
  const postPreview = document.createElement('div');
  postPreview.className = 'post-preview';

  for (let i = 0; i < 10; i++) {
    const postSlide = document.createElement('div');
    postSlide.className = `post-slide empty theme-${currentTheme}`;
    postSlide.id = `slide-${i}`;
    
    const emptyText = document.createElement('p');
    emptyText.textContent = `Empty Slide ${i + 1}`;
    emptyText.style.color = '#999';
    emptyText.style.fontSize = '14px';
    emptyText.style.textAlign = 'center';
    emptyText.style.margin = 'auto';
    postSlide.appendChild(emptyText);
    
    postPreview.appendChild(postSlide);
  }
  mainContent.appendChild(postPreview);

  // Metadata section
  const metadataSection = document.createElement('div');
  metadataSection.className = 'metadata-section';
  metadataSection.style.display = 'none';
  
  const metadataTitle = document.createElement('h3');
  metadataTitle.textContent = 'Instagram Post Caption';
  metadataSection.appendChild(metadataTitle);
  
  const metadataContent = document.createElement('div');
  metadataContent.className = 'metadata-content';
  metadataSection.appendChild(metadataContent);
  
  mainContent.appendChild(metadataSection);

  container.appendChild(mainContent);
  return container;
}

function selectTheme(themeName, themeOptions) {
  currentTheme = themeName;
  
  // Update active theme option
  themeOptions.querySelectorAll('.theme-option').forEach(option => {
    option.classList.remove('active');
  });
  themeOptions.querySelector(`.theme-${themeName}`).classList.add('active');
  
  // Update post slides with new theme
  const postSlides = document.querySelectorAll('.post-slide');
  postSlides.forEach(slide => {
    // Remove all theme classes first
    slide.classList.remove('theme-sunset', 'theme-ocean', 'theme-forest', 'theme-night', 'theme-rose');
    // Add current theme class
    slide.classList.add(`theme-${themeName}`);
  });
}

async function handleTranslate(lyrics, artist, button) {
  if (!lyrics.trim()) {
    alert('Please enter song lyrics');
    return;
  }
  
  const originalText = button.textContent;
  button.disabled = true;
  button.innerHTML = '<span class="loading"><span class="spinner"></span>Translating...</span>';
  
  try {
    await Actions.translate(lyrics, artist, currentTheme);
  } catch (error) {
    console.error('Translation failed:', error);
    alert('Translation failed. Please try again.');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function handleGenerateMetadata(lyrics, artist, button) {
  if (!lyrics.trim() || !artist.trim()) {
    alert('Please enter both artist/song info and lyrics');
    return;
  }
  
  const originalText = button.textContent;
  button.disabled = true;
  button.innerHTML = '<span class="loading"><span class="spinner"></span>Generating...</span>';
  
  try {
    await Actions.generateMetadata(lyrics, artist);
    document.querySelector('.metadata-section').style.display = 'block';
  } catch (error) {
    console.error('Metadata generation failed:', error);
    alert('Caption generation failed. Please try again.');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

async function handleDownloadZip(button) {
  const postSlides = document.querySelectorAll('.post-slide:not(.empty)');
  
  if (postSlides.length === 0) {
    alert('No posts to download. Please translate lyrics first.');
    return;
  }
  
  const originalText = button.textContent;
  button.disabled = true;
  button.innerHTML = '<span class="loading"><span class="spinner"></span>Creating ZIP...</span>';
  
  try {
    await Actions.downloadZip();
  } catch (error) {
    console.error('ZIP download failed:', error);
    alert('Failed to create ZIP file. Please try again.');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
}

root.appendChild(App());