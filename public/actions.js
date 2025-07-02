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

    const postSlides = document.querySelectorAll('.post-slide');
    
    // Clean up the response and split into sections
    const sections = translation
      .replace(/^.*?Here's.*?translation.*?:/i, '')
      .replace(/^.*?Ecco.*?traduzione.*?:/i, '')
      .split('|||')
      .map(section => section.trim())
      .filter(section => section.length > 0);

    postSlides.forEach((slide, index) => {
      slide.innerHTML = '';
      slide.classList.remove('empty');
      
      if (sections[index]) {
        const section = sections[index];
        
        // Extract original and translated text using regex
        const originalMatch = section.match(/\[ORIGINAL\](.*?)\[\/ORIGINAL\]/s);
        const italianMatch = section.match(/\[ITALIAN\](.*?)\[\/ITALIAN\]/s);
        
        let originalText = originalMatch ? originalMatch[1].trim() : '';
        let translatedText = italianMatch ? italianMatch[1].trim() : section;
        
        // Convert \n to <br /> for proper line breaks
        originalText = originalText.replace(/\n/g, '<br />');
        translatedText = translatedText.replace(/\n/g, '<br />');
        
        // Create content wrapper
        const content = document.createElement('div');
        content.style.textAlign = 'center';
        content.style.width = '100%';
        content.style.position = 'relative';
        content.style.zIndex = '2';
        
        // Add original text if available
        if (originalText) {
          const originalDiv = document.createElement('div');
          originalDiv.className = 'original-text';
          originalDiv.innerHTML = originalText;
          content.appendChild(originalDiv);
          
          // Add divider
          const divider = document.createElement('div');
          divider.className = 'text-divider';
          content.appendChild(divider);
        }
        
        // Add translated text
        const translatedDiv = document.createElement('div');
        translatedDiv.className = 'translated-text';
        translatedDiv.innerHTML = translatedText;
        content.appendChild(translatedDiv);
        
        // Add artist info on first slide
        if (index === 0 && artist) {
          const artistInfo = document.createElement('div');
          artistInfo.className = 'artist-info';
          artistInfo.textContent = artist;
          content.appendChild(artistInfo);
        }
        
        // Add slide number on slides with content
        if (sections.length > 1) {
          const slideNumber = document.createElement('div');
          slideNumber.className = 'slide-number';
          slideNumber.textContent = `${index + 1}/${sections.length}`;
          slide.appendChild(slideNumber);
        }
        
        slide.appendChild(content);
        
        // Make slide editable
        Actions.makeSlideEditable(slide, index, sections.length);
      } else {
        // Empty slide
        slide.classList.add('empty');
        const emptyText = document.createElement('p');
        emptyText.textContent = 'Slide ' + (index + 1);
        slide.appendChild(emptyText);
      }
    });
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
        
        const translatedText = exportSlide.querySelector('.translated-text');
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
          
          const translatedText = exportSlide.querySelector('.translated-text');
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
    const translatedTextEl = originalContent.querySelector('.translated-text');
    
    let originalText = '';
    let translatedText = '';
    
    if (originalTextEl) {
      originalText = originalTextEl.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/"/g, '').trim();
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
    let translatedTextEl = originalContent.querySelector('.translated-text');
    
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
      translatedTextEl.className = 'translated-text';
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
  }
};