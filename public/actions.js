const Actions = {
  translate: async (lyrics, artist, theme) => {
    const response = await fetch('/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lyrics, artist })
    });
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const { translation } = await response.json();
    const postPreview = document.querySelector('.post-preview');
    
    // Clean up the response and split into sections
    const sections = translation
      .replace(/^.*?Here's.*?translation.*?:/i, '')
      .replace(/^.*?Ecco.*?traduzione.*?:/i, '')
      .split('|||')
      .map(section => section.trim())
      .filter(section => section.length > 0);
      
    console.log('SECTION PARSING DEBUG:');
    console.log('Raw translation length:', translation.length);
    console.log('After cleanup, before split:', translation.replace(/^.*?Here's.*?translation.*?:/i, '').replace(/^.*?Ecco.*?traduzione.*?:/i, '').substring(0, 200));
    console.log('Split result count:', sections.length);

    console.log('RAW TRANSLATION from server:', translation);
    console.log('SECTIONS after splitting:', sections);
    console.log('Number of sections:', sections.length);
    
    // Debug each section individually
    sections.forEach((section, idx) => {
      console.log(`SECTION ${idx} CONTENT:`, section.substring(0, 100) + '...');
    });

    // Create slides dynamically based on the number of sections
    postPreview.innerHTML = ''; // Clear existing slides
    
    // Create slides: 1 cover slide + all sections
    for (let i = 0; i < sections.length + 1; i++) {
      const postSlide = document.createElement('div');
      postSlide.className = `post-slide theme-${theme}`;
      postSlide.id = `slide-${i}`;
      postPreview.appendChild(postSlide);
    }
    
    const postSlides = document.querySelectorAll('.post-slide');

    postSlides.forEach((slide, index) => {
      console.log(`SLIDE LOOP: Processing slide ${index}, ID: ${slide.id}`);
      slide.innerHTML = '';
      slide.classList.remove('empty');
      
      // Ensure theme class is applied
      if (!slide.classList.contains(`theme-${theme}`)) {
        slide.classList.remove('theme-sunset', 'theme-ocean', 'theme-forest', 'theme-night', 'theme-rose');
        slide.classList.add(`theme-${theme}`);
      }
      
      if (index === 0) {
        // First slide is always cover slide
        const template = Actions.createProfessionalTemplate(
          '', // no original text for cover
          '', // no translated text for cover  
          artist, 
          index,
          sections.length + 1
        );
        slide.appendChild(template);
        
      } else if (sections[index - 1]) {
        // Content slides (offset by 1 because of cover slide)
        const section = sections[index - 1];
        
        console.log(`=== PROCESSING SLIDE ${index + 1} ===`);
        console.log(`RAW SECTION ${index + 1} FULL CONTENT:`, section);
        console.log(`SECTION LENGTH:`, section.length);
        
        // Extract original and translated text using regex
        const originalMatch = section.match(/\[ORIGINAL\](.*?)\[\/ORIGINAL\]/s);
        const italianMatch = section.match(/\[ITALIAN\](.*?)\[\/ITALIAN\]/s);
        
        let originalText = originalMatch ? originalMatch[1].trim() : '';
        let translatedText = italianMatch ? italianMatch[1].trim() : '';
        
        // If no Italian match found, this might be a malformed section
        if (!italianMatch && !originalMatch) {
          // This is probably just Italian text without tags
          translatedText = section.trim();
        }
        
        console.log(`DEBUG: Section ${index + 1}:`);
        console.log('- Original match:', originalMatch);
        console.log('- Italian match:', italianMatch);
        console.log('- Extracted original:', originalText);
        console.log('- Extracted translated:', translatedText);
        console.log('- Original text length:', originalText.length);
        console.log('- Translated text length:', translatedText.length);
        
        // Clean up text formatting
        originalText = originalText.replace(/\n/g, '<br />').replace(/["'"]/g, '');
        translatedText = translatedText.replace(/\n/g, '<br />').replace(/["'"]/g, '');
        
        // Create professional template structure
        console.log(`BEFORE TEMPLATE CREATION: Slide ${index + 1}`);
        console.log('- Final originalText:', originalText);
        console.log('- Final translatedText:', translatedText);
        console.log('- Final originalText length:', originalText.length);
        console.log('- Final translatedText length:', translatedText.length);
        
        const template = Actions.createProfessionalTemplate(
          originalText, 
          translatedText, 
          artist, 
          index,
          sections.length + 1
        );
        
        console.log(`SLIDE DEBUG: Appending template to slide ${index + 1}`);
        console.log('- Template created:', template);
        console.log('- Template innerHTML before append:', template.innerHTML);
        
        slide.appendChild(template);
        
        console.log('- Slide innerHTML after append:', slide.innerHTML);
        console.log('- Translation elements in slide:', slide.querySelectorAll('.translation-text'));
        
        // Add decorative elements
        Actions.addDecorativeElements(slide, index);
        
      } else {
        // Empty slide styling
        slide.classList.add('empty');
        const emptyText = document.createElement('p');
        emptyText.textContent = `Empty Slide ${index + 1}`;
        slide.appendChild(emptyText);
      }
    });
    
    // Final debug check - see what's actually in the slides
    console.log('FINAL DEBUG: All slides processed');
    document.querySelectorAll('.post-slide').forEach((slide, idx) => {
      const translationEls = slide.querySelectorAll('.translation-text');
      console.log(`Slide ${idx + 1} final state:`, {
        hasTranslationElements: translationEls.length,
        translationContent: translationEls.length > 0 ? translationEls[0].innerHTML : 'NO TRANSLATION ELEMENT',
        slideClasses: slide.className,
        slideInnerHTML: slide.innerHTML.substring(0, 200) + '...'
      });
    });
  },

  createProfessionalTemplate: (originalText, translatedText, artist, index, total = 10) => {
    const container = document.createElement('div');
    container.className = `template-container`;
    
    // Template variations for visual interest
    const templateVariations = [
      'cover-slide',    // 0 - Hero slide with artist info
      'verse-standard', // 1 - Standard verse layout
      'verse-centered', // 2 - Centered layout
      'verse-minimal',  // 3 - Minimal design
      'verse-accent',   // 4 - With accent elements
      'verse-split',    // 5 - Split layout
      'verse-elegant',  // 6 - Elegant typography
      'verse-bold',     // 7 - Bold design
      'verse-artistic', // 8 - Artistic layout
      'outro-slide'     // 9 - Outro slide
    ];
    
    const templateType = templateVariations[index] || 'verse-standard';
    container.classList.add(templateType);
    
    if (index === 0) {
      // Cover slide with artist information
      const brandMark = document.createElement('div');
      brandMark.className = 'template-brand';
      brandMark.textContent = 'SONG TRANSLATION';
      container.appendChild(brandMark);
      
      const title = document.createElement('h1');
      title.className = 'template-title cover-title';
      title.textContent = artist || 'Unknown Artist';
      container.appendChild(title);
      
      const subtitle = document.createElement('div');
      subtitle.className = 'template-subtitle cover-subtitle';
      subtitle.textContent = 'TRADUZIONE ITALIANA';
      container.appendChild(subtitle);
      
      // Add decorative line
      const decorativeLine = document.createElement('div');
      decorativeLine.className = 'decorative-line';
      container.appendChild(decorativeLine);
      
    } else {
      // Content slides with lyrics
      // Main content area
      const mainContent = document.createElement('div');
      mainContent.className = 'main-content-area';
      
      // Original text (if exists)
      if (originalText && originalText.trim()) {
        const originalSection = document.createElement('div');
        originalSection.className = 'original-section';
        
        const originalLabel = document.createElement('div');
        originalLabel.className = 'text-label';
        originalLabel.textContent = 'Original';
        originalSection.appendChild(originalLabel);
        
        const originalContent = document.createElement('div');
        originalContent.className = 'original-text';
        originalContent.innerHTML = Actions.formatText(originalText);
        originalSection.appendChild(originalContent);
        
        mainContent.appendChild(originalSection);
      }
      
      // Italian translation
      const translationSection = document.createElement('div');
      translationSection.className = 'translation-section';
      
      const translationLabel = document.createElement('div');
      translationLabel.className = 'text-label translation-label';
      translationLabel.textContent = 'Italiano';
      translationSection.appendChild(translationLabel);
      
      const translationContent = document.createElement('div');
      translationContent.className = 'translation-text';
      translationContent.innerHTML = Actions.formatText(translatedText);
      translationSection.appendChild(translationContent);
      
      console.log(`TEMPLATE DEBUG: Creating Italian section for slide ${index + 1}`);
      console.log('- translatedText passed in:', translatedText);
      console.log('- formatText result:', Actions.formatText(translatedText));
      console.log('- translationContent.innerHTML:', translationContent.innerHTML);
      
      mainContent.appendChild(translationSection);
      container.appendChild(mainContent);
    }
    
    // Slide number
    const slideNumber = document.createElement('div');
    slideNumber.className = 'slide-number';
    slideNumber.textContent = `${index + 1}/${total}`;
    container.appendChild(slideNumber);
    
    return container;
  },

  formatText: (text) => {
    if (!text) return '';
    
    // Clean and format text for better display
    return text
      .replace(/\n/g, '<br>')
      .replace(/["'"]/g, '')
      .trim();
  },

  addDecorativeElements: (slide, index) => {
    // Simplified decorative elements to reduce DOM complexity
    if (index % 5 === 0) {
      // Only add decorative elements to every 5th slide to reduce load
      const decoration = document.createElement('div');
      decoration.className = 'simple-decoration';
      decoration.style.position = 'absolute';
      decoration.style.top = '20px';
      decoration.style.right = '20px';
      decoration.style.width = '30px';
      decoration.style.height = '30px';
      decoration.style.background = 'currentColor';
      decoration.style.opacity = '0.1';
      decoration.style.borderRadius = '50%';
      decoration.style.zIndex = '1';
      slide.appendChild(decoration);
    }
  },

  generateMetadata: async (lyrics, artist) => {
    const response = await fetch('/generate-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lyrics, artist })
    });
    
    if (!response.ok) {
      throw new Error('Metadata generation failed');
    }
    
    const { metadata } = await response.json();
    
    const metadataContent = document.querySelector('.metadata-content');
    metadataContent.innerHTML = '';
    
    const metadataText = document.createElement('p');
    metadataText.style.lineHeight = '1.6';
    metadataText.style.whiteSpace = 'pre-line';
    metadataText.textContent = metadata;
    
    metadataContent.appendChild(metadataText);
    
    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'btn btn-secondary';
    copyButton.textContent = 'Copy Caption';
    copyButton.style.marginTop = '15px';
    copyButton.onclick = () => {
      navigator.clipboard.writeText(metadata).then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy Caption';
        }, 2000);
      });
    };
    
    metadataContent.appendChild(copyButton);
  },

  download: () => {
    const postSlides = document.querySelectorAll('.post-slide:not(.empty)');
    
    if (postSlides.length === 0) {
      alert('No posts to download. Please translate lyrics first.');
      return;
    }
    
    postSlides.forEach(async (slide, index) => {
      try {
        // Create a clone with better styling for export
        const exportSlide = slide.cloneNode(true);
        exportSlide.style.width = '1080px';
        exportSlide.style.height = '1080px';
        exportSlide.style.padding = '80px';
        
        // Adjust font sizes and spacing for export
        const originalText = exportSlide.querySelector('.original-text');
        if (originalText) {
          originalText.style.fontSize = '32px';
          originalText.style.marginBottom = '40px';
          originalText.style.lineHeight = '1.3';
        }
        
        const translatedText = exportSlide.querySelector('.translation-text');
        if (translatedText) {
          translatedText.style.fontSize = '42px';
          translatedText.style.lineHeight = '1.3';
          translatedText.style.letterSpacing = '0.5px';
        }
        
        const textDivider = exportSlide.querySelector('.text-divider');
        if (textDivider) {
          textDivider.style.width = '80px';
          textDivider.style.height = '4px';
          textDivider.style.margin = '35px auto';
        }
        
        const artistInfo = exportSlide.querySelector('.artist-info');
        if (artistInfo) {
          artistInfo.style.fontSize = '28px';
          artistInfo.style.marginTop = '50px';
          artistInfo.style.letterSpacing = '1px';
        }
        
        const slideNumber = exportSlide.querySelector('.slide-number');
        if (slideNumber) {
          slideNumber.style.fontSize = '22px';
          slideNumber.style.bottom = '40px';
          slideNumber.style.right = '40px';
          slideNumber.style.padding = '12px 20px';
        }
        
        // Temporarily add to document for rendering
        exportSlide.style.position = 'fixed';
        exportSlide.style.top = '-9999px';
        exportSlide.style.left = '-9999px';
        document.body.appendChild(exportSlide);
        
        const canvas = await html2canvas(exportSlide, {
          width: 1080,
          height: 1080,
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null
        });
        
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `song-translation-${index + 1}.png`;
        link.click();
        
        // Clean up
        document.body.removeChild(exportSlide);
        
        // Add delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error generating image:', error);
        alert(`Error generating image ${index + 1}. Please try again.`);
      }
    });
  },

  downloadZip: async () => {
    const postSlides = document.querySelectorAll('.post-slide:not(.empty)');
    
    if (postSlides.length === 0) {
      throw new Error('No posts to download');
    }
    
    const zip = new JSZip();
    const promises = [];
    
    postSlides.forEach((slide, index) => {
      const promise = (async () => {
        try {
          // Create a clone with better styling for export
          const exportSlide = slide.cloneNode(true);
          exportSlide.style.width = '1080px';
          exportSlide.style.height = '1080px';
          exportSlide.style.padding = '80px';
          
          // Adjust font sizes and spacing for export
          const originalText = exportSlide.querySelector('.original-text');
          if (originalText) {
            originalText.style.fontSize = '32px';
            originalText.style.marginBottom = '40px';
            originalText.style.lineHeight = '1.3';
          }
          
          const translatedText = exportSlide.querySelector('.translation-text');
          if (translatedText) {
            translatedText.style.fontSize = '42px';
            translatedText.style.lineHeight = '1.3';
            translatedText.style.letterSpacing = '0.5px';
          }
          
          const textDivider = exportSlide.querySelector('.text-divider');
          if (textDivider) {
            textDivider.style.width = '80px';
            textDivider.style.height = '4px';
            textDivider.style.margin = '35px auto';
          }
          
          const artistInfo = exportSlide.querySelector('.artist-info');
          if (artistInfo) {
            artistInfo.style.fontSize = '28px';
            artistInfo.style.marginTop = '50px';
            artistInfo.style.letterSpacing = '1px';
          }
          
          const slideNumber = exportSlide.querySelector('.slide-number');
          if (slideNumber) {
            slideNumber.style.fontSize = '22px';
            slideNumber.style.bottom = '40px';
            slideNumber.style.right = '40px';
            slideNumber.style.padding = '12px 20px';
          }
          
          // Temporarily add to document for rendering
          exportSlide.style.position = 'fixed';
          exportSlide.style.top = '-9999px';
          exportSlide.style.left = '-9999px';
          document.body.appendChild(exportSlide);
          
          const canvas = await html2canvas(exportSlide, {
            width: 1080,
            height: 1080,
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
          });
          
          // Clean up
          document.body.removeChild(exportSlide);
          
          // Convert canvas to blob and add to zip
          return new Promise((resolve) => {
            canvas.toBlob((blob) => {
              zip.file(`song-translation-${String(index + 1).padStart(2, '0')}.png`, blob);
              resolve();
            }, 'image/png');
          });
        } catch (error) {
          console.error(`Error generating image ${index + 1}:`, error);
          throw error;
        }
      })();
      
      promises.push(promise);
    });
    
    // Wait for all images to be generated
    await Promise.all(promises);
    
    // Generate and download the ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'song-translations.zip';
    link.click();
    
    // Clean up the object URL
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  },

  makeSlideEditable: (slide, index, totalSlides) => {
    slide.classList.add('editable');
    
    // Add edit hint
    const editHint = document.createElement('div');
    editHint.className = 'edit-hint';
    editHint.textContent = 'Click to edit';
    slide.appendChild(editHint);
    
    slide.addEventListener('click', () => {
      if (slide.classList.contains('editing')) return;
      
      const originalContent = slide.querySelector('div[style*="z-index: 2"]');
      if (!originalContent) return;
      
      Actions.enterEditMode(slide, originalContent, index, totalSlides);
    });
  },

  enterEditMode: (slide, originalContent, index, totalSlides) => {
    slide.classList.add('editing');
    
    // Get current text content with better fallbacks
    const originalTextEl = originalContent.querySelector('.original-text');
    const translatedTextEl = originalContent.querySelector('.translation-text');
    
    let originalText = '';
    let translatedText = '';
    
    if (originalTextEl) {
      originalText = originalTextEl.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/"/g, '').trim();
    }
    
    if (!translatedTextEl) {
      translatedTextEl = originalContent.querySelector('.translation-text');
    }
    
    if (translatedTextEl) {
      translatedText = translatedTextEl.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/"/g, '').trim();
    } else {
      // Fallback: try to get text from any p element
      const pElement = originalContent.querySelector('p');
      if (pElement) {
        translatedText = pElement.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/"/g, '').trim();
      }
    }
    
    console.log('Editing mode:', { originalText, translatedText, originalContent });
    
    // Hide original content
    originalContent.style.display = 'none';
    
    // Create edit interface
    const editContainer = document.createElement('div');
    editContainer.style.position = 'relative';
    editContainer.style.zIndex = '2';
    editContainer.style.width = '100%';
    editContainer.style.maxWidth = '90%';
    
    // Original text editor (if exists)
    if (originalText) {
      const originalLabel = document.createElement('div');
      originalLabel.textContent = 'Original:';
      originalLabel.style.fontSize = '12px';
      originalLabel.style.marginBottom = '5px';
      originalLabel.style.opacity = '0.8';
      editContainer.appendChild(originalLabel);
      
      const originalTextarea = document.createElement('textarea');
      originalTextarea.className = 'edit-textarea';
      originalTextarea.value = originalText.replace(/"/g, '').trim();
      originalTextarea.style.fontSize = '14px';
      originalTextarea.style.marginBottom = '15px';
      originalTextarea.placeholder = 'Original lyrics...';
      editContainer.appendChild(originalTextarea);
    }
    
    // Translated text editor
    const translatedLabel = document.createElement('div');
    translatedLabel.textContent = 'Italian:';
    translatedLabel.style.fontSize = '12px';
    translatedLabel.style.marginBottom = '5px';
    translatedLabel.style.opacity = '0.8';
    editContainer.appendChild(translatedLabel);
    
    const translatedTextarea = document.createElement('textarea');
    translatedTextarea.className = 'edit-textarea';
    translatedTextarea.value = translatedText.replace(/"/g, '').trim();
    translatedTextarea.style.fontSize = '16px';
    translatedTextarea.style.fontWeight = '600';
    translatedTextarea.placeholder = 'Italian translation...';
    editContainer.appendChild(translatedTextarea);
    
    // Edit controls
    const controls = document.createElement('div');
    controls.className = 'edit-controls';
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'edit-btn save';
    saveBtn.textContent = 'Save';
    saveBtn.onclick = () => {
      const newOriginal = originalText ? originalTextarea.value : '';
      const newTranslated = translatedTextarea.value;
      Actions.saveSlideEdit(slide, originalContent, editContainer, newOriginal, newTranslated, index, totalSlides);
    };
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'edit-btn cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => {
      Actions.cancelSlideEdit(slide, originalContent, editContainer);
    };
    
    controls.appendChild(saveBtn);
    controls.appendChild(cancelBtn);
    editContainer.appendChild(controls);
    
    slide.appendChild(editContainer);
    
    // Focus on the main textarea
    translatedTextarea.focus();
    
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        Actions.cancelSlideEdit(slide, originalContent, editContainer);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  },

  saveSlideEdit: (slide, originalContent, editContainer, newOriginal, newTranslated, index, totalSlides) => {
    // Update the original content
    let originalTextEl = originalContent.querySelector('.original-text');
    let translatedTextEl = originalContent.querySelector('.translation-text');
    
    // If elements don't exist, create them
    if (!originalTextEl && newOriginal.trim()) {
      originalTextEl = document.createElement('div');
      originalTextEl.className = 'original-text';
      originalContent.insertBefore(originalTextEl, originalContent.firstChild);
      
      // Add divider after original text
      const divider = document.createElement('div');
      divider.className = 'text-divider';
      originalContent.insertBefore(divider, originalTextEl.nextSibling);
    }
    
    if (!translatedTextEl) {
      translatedTextEl = document.createElement('div');
      translatedTextEl.className = 'translation-text';
      // Insert before artist info or at the end
      const artistInfo = originalContent.querySelector('.artist-info');
      if (artistInfo) {
        originalContent.insertBefore(translatedTextEl, artistInfo);
      } else {
        originalContent.appendChild(translatedTextEl);
      }
    }
    
    // Update content
    if (originalTextEl && newOriginal.trim()) {
      originalTextEl.innerHTML = newOriginal.replace(/\n/g, '<br />');
      originalTextEl.style.display = '';
      // Show divider if we have original text
      const divider = originalContent.querySelector('.text-divider');
      if (divider) divider.style.display = '';
    } else if (originalTextEl) {
      // Hide original text and divider if empty
      originalTextEl.style.display = 'none';
      const divider = originalContent.querySelector('.text-divider');
      if (divider) divider.style.display = 'none';
    }
    
    if (translatedTextEl && newTranslated.trim()) {
      translatedTextEl.innerHTML = newTranslated.replace(/\n/g, '<br />');
    }
    
    // Debug logging
    console.log('Slide updated:', {
      original: newOriginal,
      translated: newTranslated,
      originalEl: originalTextEl,
      translatedEl: translatedTextEl
    });
    
    Actions.exitEditMode(slide, originalContent, editContainer);
  },

  cancelSlideEdit: (slide, originalContent, editContainer) => {
    Actions.exitEditMode(slide, originalContent, editContainer);
  },

  exitEditMode: (slide, originalContent, editContainer) => {
    slide.classList.remove('editing');
    originalContent.style.display = '';
    editContainer.remove();
  },

  createDecorativeElements: (index) => {
    const elements = [];
    
    // Create different decorative patterns for variety
    switch (index % 4) {
      case 0:
        // Circle decoration
        const circle = document.createElement('div');
        circle.className = 'decoration-circle';
        elements.push(circle);
        break;
        
      case 1:
        // Triangle decoration
        const triangle = document.createElement('div');
        triangle.className = 'decoration-triangle';
        elements.push(triangle);
        break;
        
      case 2:
        // Dots decoration
        const dots = document.createElement('div');
        dots.className = 'decoration-dots';
        elements.push(dots);
        break;
        
      case 3:
        // Pattern decoration
        const pattern = document.createElement('div');
        pattern.className = 'decoration-pattern';
        elements.push(pattern);
        break;
    }
    
    return elements;
  }
};