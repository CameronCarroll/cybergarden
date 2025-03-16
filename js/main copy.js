// Apply theme before DOM content loaded to prevent flash
(function() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply theme to both html and body elements immediately
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.body && document.body.classList.add('dark-mode');
    } else {
        document.documentElement.classList.add('light-mode');
        document.body && document.body.classList.add('light-mode');
    }
    
    // Flag to prevent duplicate execution
    window.mainScriptLoaded = true;
})();

document.addEventListener('DOMContentLoaded', function() {
    // Dark/Light mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply the theme preference
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        themeToggle.textContent = '☀️';
    } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            // Switch to light mode
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
            document.documentElement.classList.add('light-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            // Switch to dark mode
            document.documentElement.classList.remove('light-mode');
            document.body.classList.remove('light-mode');
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });
    
    // Hamburger menu functionality
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');
    const menuBackdrop = document.querySelector('.menu-backdrop');
    const categoryTitles = document.querySelectorAll('.category-title');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    // Toggle mobile menu
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuBackdrop.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu when clicking outside
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', function() {
            mainNav.classList.remove('active');
            menuBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Handle category click on mobile
    function setupMobileMenu() {
        // Match the JavaScript mobile breakpoint with CSS mobile breakpoint
        const isMobile = window.innerWidth <= 768;
        
        categoryTitles.forEach((title, index) => {
            // Remove existing click listeners by cloning and replacing
            const newTitle = title.cloneNode(true);
            title.parentNode.replaceChild(newTitle, title);
            
            // Add click listeners for both mobile AND tablet
            // Since we want the click behavior whenever the submenu is not auto-displayed via hover
            newTitle.addEventListener('click', function(e) {
                e.preventDefault();
                
                // For proper mobile & tablet behavior
                if (window.innerWidth <= 992) {
                    // Close all other open menus
                    menuCategories.forEach((cat, i) => {
                        if (i !== index) {
                            cat.classList.remove('active');
                        }
                    });
                    
                    // Toggle this menu
                    menuCategories[index].classList.toggle('active');
                }
            });
        });
    }
    
    // Initial setup
    setupMobileMenu();
    
    // Reconfigure menu behavior on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Close mobile menu on larger screens
            mainNav.classList.remove('active');
            menuBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Update mobile category toggles
        setupMobileMenu();
    });
    
    // Add copy functionality to code blocks
    document.querySelectorAll('pre').forEach(function(codeBlock) {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = 'Copy';
        codeBlock.appendChild(copyButton);
        
        // Add click event
        copyButton.addEventListener('click', function() {
            const code = codeBlock.querySelector('code');
            const range = document.createRange();
            range.selectNode(code);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            
            try {
                document.execCommand('copy');
                copyButton.textContent = 'Copied!';
                setTimeout(function() {
                    copyButton.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                copyButton.textContent = 'Failed!';
                console.error('Unable to copy', err);
            }
            
            window.getSelection().removeAllRanges();
        });
    });
    
    // Active navigation highlighting
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(function(link) {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (currentPage === linkPage || 
            (currentPage === '' && linkPage === 'index.html') || 
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Resources page search/filter functionality
    const searchInput = document.getElementById('resource-search');
    const categoryFilter = document.getElementById('category-filter');
    const resourceItems = document.querySelectorAll('.resource-item');
    
    if (searchInput && categoryFilter && resourceItems.length > 0) {
        const filterResources = function() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = categoryFilter.value;
            
            resourceItems.forEach(function(item) {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                const category = item.getAttribute('data-category');
                
                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
                
                if (matchesSearch && matchesCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };
        
        searchInput.addEventListener('input', filterResources);
        categoryFilter.addEventListener('change', filterResources);
    }
});