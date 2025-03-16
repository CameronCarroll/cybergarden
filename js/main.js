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
    
 // ----- RESPONSIVE MENU SETUP -----
 const hamburgerBtn = document.getElementById('hamburger-btn');
 const mainNav = document.getElementById('main-nav');
 const menuBackdrop = document.querySelector('.menu-backdrop');
 
 // Toggle mobile menu (for mobile only)
 if (hamburgerBtn) {
     hamburgerBtn.addEventListener('click', function() {
         mainNav.classList.toggle('active');
         menuBackdrop.classList.toggle('active');
         document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
     });
 }
 
 // Close menu when clicking outside (mobile only)
 if (menuBackdrop) {
     menuBackdrop.addEventListener('click', function() {
         mainNav.classList.remove('active');
         menuBackdrop.classList.remove('active');
         document.body.style.overflow = '';
     });
 }
 
 // Function to set up the click behavior for category titles
 function setupMenuBehavior() {
     // First, remove any existing click handlers by replacing elements
     document.querySelectorAll('.category-title').forEach(title => {
         const newTitle = title.cloneNode(true);
         title.parentNode.replaceChild(newTitle, title);
     });
     
     // Add fresh click handlers to the new elements
     document.querySelectorAll('.category-title').forEach(title => {
         title.addEventListener('click', function(e) {
             // Check if we're in mobile or tablet mode
             if (window.innerWidth <= 992) {
                 e.preventDefault();
                 
                 const category = this.closest('.menu-category');
                 const isActive = category.classList.contains('active');
                 
                 // Close all categories first
                 document.querySelectorAll('.menu-category').forEach(cat => {
                     cat.classList.remove('active');
                 });
                 
                 // Toggle this category (only open if it wasn't already open)
                 if (!isActive) {
                     category.classList.add('active');
                 }
             }
         });
     });
     
     // Add document-wide click handler to close menus when clicking outside
     // (but only in tablet mode)
     const isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
     
     if (isTablet) {
         // Use setTimeout to ensure this runs after other click handlers
         setTimeout(() => {
             document.addEventListener('click', closeMenusOnClickOutside);
         }, 0);
     } else {
         document.removeEventListener('click', closeMenusOnClickOutside);
     }
 }
 
 // Function to close menus when clicking outside
 function closeMenusOnClickOutside(e) {
     // Only act if we're in tablet mode
     if (window.innerWidth <= 992 && window.innerWidth > 768) {
         // If the click wasn't inside a menu category
         if (!e.target.closest('.menu-category')) {
             // Close all categories
             document.querySelectorAll('.menu-category').forEach(cat => {
                 cat.classList.remove('active');
             });
         }
     }
 }
 
 // Initial setup
 setupMenuBehavior();
 
 // Update on window resize
 window.addEventListener('resize', function() {
     // Close mobile menu when resizing to larger screens
     if (window.innerWidth > 768) {
         mainNav.classList.remove('active');
         menuBackdrop.classList.remove('active');
         document.body.style.overflow = '';
     }
     
     // Update menu behavior for new viewport size
     setupMenuBehavior();
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
    
    // ---- TABLET MENU ENHANCEMENTS ----
    
    // Tablet menu enhancement function
    function enhanceTabletMenu() {
        const isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
        const mainContent = document.querySelector('main');
        const mainNav = document.getElementById('main-nav');
        const menuCategories = document.querySelectorAll('.menu-category');
        
        // Close all submenus when switching to tablet view
        if (isTablet) {
            menuCategories.forEach(category => {
                category.classList.remove('active');
            });
            
            // Measure menu height and adjust main content margin if needed
            const navHeight = mainNav.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            if (navHeight > viewportHeight * 0.6) {
                mainContent.classList.add('expanded-menu-margin');
            } else {
                mainContent.classList.remove('expanded-menu-margin');
            }
        } else {
            mainContent.classList.remove('expanded-menu-margin');
        }
    }
    
    // Call on initial load and window resize
    enhanceTabletMenu();
    window.addEventListener('resize', enhanceTabletMenu);
    
    // Add scroll position memory for the menu
    let lastScrollPosition = 0;
    
    if (mainNav) {
        mainNav.addEventListener('scroll', function() {
            lastScrollPosition = mainNav.scrollTop;
        });
        
        // Restore scroll position when switching between menus
        document.querySelectorAll('.category-title').forEach(title => {
            title.addEventListener('click', function() {
                setTimeout(() => {
                    mainNav.scrollTop = lastScrollPosition;
                }, 10);
            });
        });
    }

    // Add this to your DOMContentLoaded event handler

// Enhanced tablet menu functionality
function setupTabletMenu() {
    const isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
    const mainContent = document.querySelector('main');
    const mainNav = document.getElementById('main-nav');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    // Skip if not in tablet mode
    if (!isTablet) {
      mainContent.classList.remove('menu-expanded');
      return;
    }
    
    // Reset all menus when entering tablet mode
    menuCategories.forEach(category => {
      category.classList.remove('active');
    });
    
    // Add close buttons to all submenus if they don't already exist
    menuCategories.forEach(category => {
      const submenu = category.querySelector('.submenu');
      if (submenu && !submenu.querySelector('.submenu-close')) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'submenu-close';
        closeBtn.innerHTML = '✕';
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          category.classList.remove('active');
        });
        submenu.appendChild(closeBtn);
      }
    });
    
    // Handle clicks outside active menus
    document.addEventListener('click', function(e) {
      if (isTablet) {
        const isClickInsideMenu = e.target.closest('.menu-category');
        if (!isClickInsideMenu) {
          menuCategories.forEach(category => {
            category.classList.remove('active');
          });
        }
      }
    });
    
    // Enable direct click to links in submenus
    document.querySelectorAll('.submenu a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }
  
  // Call it initially and on resize
  setupTabletMenu();
  window.addEventListener('resize', setupTabletMenu);
  
  // Improve category title click handling for tablet
  document.querySelectorAll('.category-title').forEach(title => {
    title.addEventListener('click', function(e) {
      const isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
      if (isTablet) {
        e.preventDefault();
        e.stopPropagation();
        
        const category = this.closest('.menu-category');
        const wasActive = category.classList.contains('active');
        
        // Close all other categories
        document.querySelectorAll('.menu-category').forEach(cat => {
          cat.classList.remove('active');
        });
        
        // Toggle this category (don't open if it was already open)
        if (!wasActive) {
          category.classList.add('active');
        }
      }
    });
  });
});