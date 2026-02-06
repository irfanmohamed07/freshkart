/**
 * Image error handler - adds fallback for broken images
 */
document.addEventListener('DOMContentLoaded', function() {
    // Handle all images with error event
    const images = document.querySelectorAll('img[src]');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with placeholder or hide
            this.onerror = null; // Prevent infinite loop
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            this.style.objectFit = 'contain';
            this.style.backgroundColor = '#f3f4f6';
        });

        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
});
