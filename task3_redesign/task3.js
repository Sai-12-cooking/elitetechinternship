/* ========================================
   Task 3: WhatsApp Message Search Redesign
   JavaScript - Interactive Functionality
   
   Purpose: Handle all interactive features
   - Search input with real-time feedback
   - Filter application and reset
   - Dynamic result display
   - State management (empty, loading, results, no-results)
   - User interaction feedback
   ======================================== */

// ========================================
// 1. MOCK DATA: Sample messages for demonstration
// ========================================

const mockMessages = [
    {
        id: 1,
        sender: 'Sarah',
        avatar: 'S',
        content: 'Hey! Did you see the new design mockup I sent? Let me know your thoughts on the search feature redesign.',
        timestamp: '2 hours ago',
        date: 'today',
        mediaType: 'text',
        conversation: 'Sarah'
    },
    {
        id: 2,
        sender: 'John',
        avatar: 'J',
        content: 'The quarterly report is ready for review. Check your files for the updated spreadsheet and analytics.',
        timestamp: '1 day ago',
        date: 'yesterday',
        mediaType: 'document',
        conversation: 'John'
    },
    {
        id: 3,
        sender: 'Sarah',
        avatar: 'S',
        content: 'Meeting at 3 PM today to discuss the new features. Please come prepared with your insights.',
        timestamp: '3 days ago',
        date: 'week',
        mediaType: 'text',
        conversation: 'Sarah'
    },
    {
        id: 4,
        sender: 'Team Chat',
        avatar: 'T',
        content: 'Screenshot of the mobile mockup - see how the interface responds to user interactions.',
        timestamp: '1 week ago',
        date: 'month',
        mediaType: 'image',
        conversation: 'Team Chat'
    },
    {
        id: 5,
        sender: 'John',
        avatar: 'J',
        content: 'Video recording of the user research session. Watch it and share your observations.',
        timestamp: '2 weeks ago',
        date: 'month',
        mediaType: 'video',
        conversation: 'John'
    },
    {
        id: 6,
        sender: 'Sarah',
        avatar: 'S',
        content: 'Design feedback: The search results need better visual hierarchy. Consider using cards with avatars.',
        timestamp: '3 weeks ago',
        date: 'month',
        mediaType: 'text',
        conversation: 'Sarah'
    },
    {
        id: 7,
        sender: 'Team Chat',
        avatar: 'T',
        content: 'Presentation file for stakeholder meeting. Password protected - check email for details.',
        timestamp: '1 month ago',
        date: 'month',
        mediaType: 'document',
        conversation: 'Team Chat'
    },
    {
        id: 8,
        sender: 'John',
        avatar: 'J',
        content: 'Updated wireframes based on user feedback. The new search feature is now more intuitive.',
        timestamp: '1 month ago',
        date: 'month',
        mediaType: 'image',
        conversation: 'John'
    }
];

// ========================================
// 2. STATE MANAGEMENT
// ========================================

/* Current application state object
   Tracks:
   - Search query: the user's search text
   - Active filters: currently applied filter settings
   - Search results: filtered messages matching criteria
   - Loading: whether search is in progress
   - Searched: whether a search has been performed
*/
const appState = {
    searchQuery: '',
    filters: {
        date: 'all',
        sender: 'all',
        mediaType: 'all'
    },
    results: [],
    loading: false,
    searched: false
};

// ========================================
// 3. DOM ELEMENTS CACHE
// ========================================

/* Cache frequently accessed DOM elements
   This improves performance by avoiding repeated DOM queries
*/
const domElements = {
    // Input and filter elements
    searchInput: document.getElementById('searchInput'),
    clearBtn: document.getElementById('clearBtn'),
    dateFilter: document.getElementById('dateFilter'),
    senderFilter: document.getElementById('senderFilter'),
    mediaFilter: document.getElementById('mediaFilter'),
    searchBtn: document.getElementById('searchBtn'),
    backBtn: document.getElementById('backBtn'),
    
    // Results display elements
    resultsList: document.getElementById('resultsList'),
    emptyState: document.getElementById('emptyState'),
    loadingState: document.getElementById('loadingState'),
    noResults: document.getElementById('noResults'),
    resultCounter: document.getElementById('resultCounter'),
    resultCountText: document.getElementById('resultCountText'),
    
    // Template
    messageTemplate: document.getElementById('messageTemplate')
};

// ========================================
// 4. EVENT LISTENERS - SEARCH INPUT
// ========================================

/**
 * Real-time search input handling
 * Purpose: Update search query as user types
 * UX Benefit: Immediate visual feedback of search text
 */
domElements.searchInput.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value.toLowerCase();
    
    /* Show/hide clear button based on input */
    domElements.clearBtn.style.opacity = appState.searchQuery ? '1' : '0';
    domElements.clearBtn.style.pointerEvents = appState.searchQuery ? 'auto' : 'none';
});

/**
 * Clear button handler
 * Purpose: Reset search input completely
 * UX Benefit: Quick way to start new search
 */
domElements.clearBtn.addEventListener('click', () => {
    appState.searchQuery = '';
    domElements.searchInput.value = '';
    domElements.clearBtn.style.opacity = '0';
    domElements.clearBtn.style.pointerEvents = 'none';
    domElements.searchInput.focus();
    resetResults();
});

// ========================================
// 5. EVENT LISTENERS - FILTERS
// ========================================

/**
 * Date filter change handler
 * Purpose: Update date filter when user selects new option
 * UX Benefit: Allows temporal filtering for older messages
 */
domElements.dateFilter.addEventListener('change', (e) => {
    appState.filters.date = e.target.value;
});

/**
 * Sender filter change handler
 * Purpose: Update sender filter for person-specific searches
 * UX Benefit: Find messages from specific people quickly
 */
domElements.senderFilter.addEventListener('change', (e) => {
    appState.filters.sender = e.target.value;
});

/**
 * Media type filter change handler
 * Purpose: Filter by message type (text, image, video, document)
 * UX Benefit: Quickly find specific media types
 */
domElements.mediaFilter.addEventListener('change', (e) => {
    appState.filters.mediaType = e.target.value;
});

// ========================================
// 6. EVENT LISTENER - MAIN SEARCH BUTTON
// ========================================

/**
 * Search button click handler
 * Purpose: Execute search with current filters
 * Flow: Show loading → Filter messages → Display results
 */
domElements.searchBtn.addEventListener('click', performSearch);

/**
 * Function: performSearch()
 * Purpose: Main search logic with filtering
 * 
 * Algorithm:
 * 1. Validate search input
 * 2. Show loading state
 * 3. Simulate API delay (500ms) for realistic UX
 * 4. Filter messages based on:
 *    - Search keyword (case-insensitive)
 *    - Selected date range
 *    - Selected sender
 *    - Selected media type
 * 5. Display results or no-results state
 */
function performSearch() {
    const query = appState.searchQuery.trim();
    
    /* Validation: Require at least some search criteria */
    if (!query && appState.filters.date === 'all' && appState.filters.sender === 'all' && appState.filters.mediaType === 'all') {
        alert('Please enter a search query or select filters');
        return;
    }
    
    /* Mark that a search has been performed */
    appState.searched = true;
    appState.loading = true;
    
    /* Show loading state */
    showLoadingState();
    
    /* Simulate API call delay (500ms) for realistic user feedback */
    setTimeout(() => {
        /* Filter messages based on all criteria */
        appState.results = filterMessages(mockMessages);
        
        appState.loading = false;
        
        /* Display results or no-results state */
        if (appState.results.length === 0) {
            showNoResultsState();
        } else {
            displayResults(appState.results);
        }
    }, 500);
}

// ========================================
// 7. SEARCH & FILTER LOGIC
// ========================================

/**
 * Function: filterMessages(messages)
 * Purpose: Apply all active filters to messages
 * 
 * Filters applied:
 * 1. Keyword matching in message content
 * 2. Date range filtering
 * 3. Sender filtering
 * 4. Media type filtering
 * 
 * @param {Array} messages - Array of message objects to filter
 * @returns {Array} - Filtered messages matching all criteria
 */
function filterMessages(messages) {
    return messages.filter(message => {
        /* Keyword filter: Check if search query appears in message content */
        const keywordMatch = !appState.searchQuery || 
            message.content.toLowerCase().includes(appState.searchQuery);
        
        if (!keywordMatch) return false;
        
        /* Date filter: Check if message falls within selected date range */
        const dateMatch = appState.filters.date === 'all' || 
            message.date === appState.filters.date ||
            (appState.filters.date === '24h' && message.date === 'today') ||
            (appState.filters.date === 'week' && (message.date === 'today' || message.date === 'yesterday' || message.date === 'week')) ||
            (appState.filters.date === 'month' && message.date === 'month');
        
        if (!dateMatch) return false;
        
        /* Sender filter: Check if message is from selected sender */
        const senderMatch = appState.filters.sender === 'all' || 
            message.conversation.toLowerCase() === appState.filters.sender.toLowerCase();
        
        if (!senderMatch) return false;
        
        /* Media type filter: Check if message matches selected media type */
        const mediaMatch = appState.filters.mediaType === 'all' || 
            message.mediaType === appState.filters.mediaType;
        
        if (!mediaMatch) return false;
        
        /* Message passes all filters */
        return true;
    });
}

// ========================================
// 8. DISPLAY FUNCTIONS - Result Rendering
// ========================================

/**
 * Function: displayResults(results)
 * Purpose: Render search results to the DOM
 * 
 * Process:
 * 1. Clear previous results
 * 2. Hide empty/loading/no-results states
 * 3. Create result cards from template
 * 4. Highlight search keywords in preview
 * 5. Add click handlers to result cards
 * 6. Show result counter
 */
function displayResults(results) {
    /* Clear previous results */
    domElements.resultsList.innerHTML = '';
    
    /* Hide all state messages */
    domElements.emptyState.classList.add('hidden');
    domElements.loadingState.classList.remove('active');
    domElements.noResults.classList.remove('active');
    
    /* Create and append result cards */
    results.forEach((message, index) => {
        const resultCard = createResultCard(message);
        domElements.resultsList.appendChild(resultCard);
        
        /* Add smooth fade-in animation */
        setTimeout(() => {
            resultCard.classList.add('visible');
        }, index * 50);
    });
    
    /* Update and display result counter */
    updateResultCounter(results.length);
}

/**
 * Function: createResultCard(message)
 * Purpose: Create a result card element for a single message
 * 
 * Card structure:
 * - Avatar with sender initial
 * - Sender name and timestamp
 * - Message preview with keyword highlighting
 * - Media type indicator
 * - Action button to jump to message
 * 
 * @param {Object} message - Message object to display
 * @returns {HTMLElement} - Result card element
 */
function createResultCard(message) {
    /* Clone template to create new card */
    const card = domElements.messageTemplate.content.cloneNode(true);
    const cardElement = card.querySelector('.result-card');
    
    /* Set avatar with sender initial */
    const avatar = card.querySelector('.result-avatar');
    avatar.textContent = message.avatar;
    avatar.dataset.initial = message.avatar;
    
    /* Set sender name */
    card.querySelector('.result-sender').textContent = message.sender;
    
    /* Set timestamp */
    card.querySelector('.result-time').textContent = message.timestamp;
    
    /* Set message preview with keyword highlighting */
    const preview = card.querySelector('.result-preview');
    preview.innerHTML = highlightKeyword(message.content, appState.searchQuery);
    
    /* Set media badge showing message type */
    const mediaBadge = card.querySelector('.result-media-badge');
    mediaBadge.textContent = getMediaTypeLabel(message.mediaType);
    
    /* Add click handler: Navigate to message in conversation */
    cardElement.addEventListener('click', () => {
        simulateNavigateToMessage(message);
    });
    
    return card;
}

/**
 * Function: highlightKeyword(text, keyword)
 * Purpose: Highlight search keyword in message preview
 * 
 * UX Benefit: Makes matching content immediately visible
 * Implementation: Wraps keyword in <mark> tag with styling
 * 
 * @param {String} text - Original message text
 * @param {String} keyword - Search keyword to highlight
 * @returns {String} - HTML with highlighted keyword
 */
function highlightKeyword(text, keyword) {
    if (!keyword) return text;
    
    /* Create regex to find all instances of keyword (case-insensitive) */
    const regex = new RegExp(`(${keyword})`, 'gi');
    
    /* Replace matches with highlighted version */
    return text.replace(regex, '<mark style="background-color: #fff3cd; color: #333; font-weight: 600; padding: 2px 4px; border-radius: 2px;">$1</mark>');
}

/**
 * Function: getMediaTypeLabel(mediaType)
 * Purpose: Convert media type to user-friendly label
 * 
 * @param {String} mediaType - Type of media (text, image, video, document)
 * @returns {String} - User-friendly label with emoji
 */
function getMediaTypeLabel(mediaType) {
    const labels = {
        'text': '📝 Text',
        'image': '🖼️ Photo',
        'video': '🎥 Video',
        'document': '📄 Document'
    };
    return labels[mediaType] || 'Message';
}

// ========================================
// 9. STATE DISPLAY FUNCTIONS
// ========================================

/**
 * Function: showLoadingState()
 * Purpose: Display loading indicator while searching
 * UX Benefit: Provides feedback that search is in progress
 */
function showLoadingState() {
    domElements.emptyState.classList.add('hidden');
    domElements.loadingState.classList.add('active');
    domElements.noResults.classList.remove('active');
    domElements.resultsList.innerHTML = '';
}

/**
 * Function: showNoResultsState()
 * Purpose: Display message when search returns no results
 * UX Benefit: Encourages user to adjust search criteria
 */
function showNoResultsState() {
    domElements.emptyState.classList.add('hidden');
    domElements.loadingState.classList.remove('active');
    domElements.noResults.classList.add('active');
    domElements.resultsList.innerHTML = '';
    
    /* Update counter to show zero results */
    domElements.resultCountText.textContent = 'No results found (0)';
}

/**
 * Function: resetResults()
 * Purpose: Clear search results and return to initial state
 * Used when: User clears search input
 */
function resetResults() {
    appState.searched = false;
    appState.results = [];
    domElements.resultsList.innerHTML = '';
    domElements.emptyState.classList.remove('hidden');
    domElements.loadingState.classList.remove('active');
    domElements.noResults.classList.remove('active');
    domElements.resultCountText.textContent = '';
}

/**
 * Function: updateResultCounter(count)
 * Purpose: Display the number of results found
 * 
 * @param {Number} count - Number of search results
 */
function updateResultCounter(count) {
    const plural = count === 1 ? 'result' : 'results';
    domElements.resultCountText.textContent = `Showing ${count} ${plural}`;
}

// ========================================
// 10. USER INTERACTION HANDLERS
// ========================================

/**
 * Function: simulateNavigateToMessage(message)
 * Purpose: Simulate navigating to message in conversation
 * UX Behavior: Show feedback that user would jump to message
 * 
 * In production: Would navigate to the actual message in the chat
 * 
 * @param {Object} message - Message to navigate to
 */
function simulateNavigateToMessage(message) {
    alert(`📍 Would navigate to message from ${message.sender}\n\n"${message.content.substring(0, 50)}..."\n\nSent ${message.timestamp}`);
}

/**
 * Function: Back button handler
 * Purpose: Return to previous screen
 * In a full app: Would navigate back in the stack
 */
domElements.backBtn.addEventListener('click', () => {
    alert('In a full app, this would return to the main chat list.');
});

// ========================================
// 11. KEYBOARD ACCESSIBILITY
// ========================================

/**
 * Keyboard event: Press Enter to search
 * Purpose: Allow users to search without clicking button
 * UX Benefit: Faster interaction for keyboard users
 */
domElements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

/**
 * Keyboard event: Escape to clear search
 * Purpose: Quick way to reset search on mobile
 * UX Benefit: Standard web convention for clearing input
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appState.searchQuery) {
        domElements.clearBtn.click();
    }
});

// ========================================
// 12. INITIALIZATION
// ========================================

/**
 * Initial setup when page loads
 * - Clear button should be hidden initially
 * - Focus on search input for better UX
 */
window.addEventListener('DOMContentLoaded', () => {
    domElements.clearBtn.style.opacity = '0';
    domElements.clearBtn.style.pointerEvents = 'none';
    domElements.searchInput.focus();
    
    /* Optional: Demonstrate search functionality with a pre-filled example */
    console.log('WhatsApp Message Search Redesign - Ready');
    console.log('Tips:');
    console.log('- Type a keyword (e.g., "design", "report", "meeting")');
    console.log('- Use filters to narrow results');
    console.log('- Click a result to jump to the message');
});