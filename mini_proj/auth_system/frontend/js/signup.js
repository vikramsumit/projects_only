// Remove entering animation after load - matches original timing
window.addEventListener('load', () => {
    setTimeout(() => document.body.classList.remove('entering'), 650);
});

// Handle page transition to login - matches original animation
document.getElementById('toLogin').addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => window.location.href = this.href, 420);
});

// Handle form submission with original animation style
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = this.querySelector('#submitBtn');
    const formData = new FormData(this);

    // Disable button and add original button animation
    btn.disabled = true;
    btn.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(.98)' },
        { transform: 'scale(1)' }
    ], { duration: 260 });

    try {
        // Prepare data for API
        const userData = {
            username: formData.get('user'),
            email: formData.get('email'),
            password: formData.get('pass')
        };

        // Show loading state
        const originalText = btn.textContent;
        btn.textContent = 'Creating Account...';

        // Make API call to backend
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            // Success - matches original demo behavior
            btn.disabled = false;
            btn.textContent = originalText;
            alert('Signed up (demo) — now on login');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 100);
        } else {
            // Handle errors
            alert(result.message || 'Sign up failed. Please try again.');
            btn.textContent = originalText;
        }
    } catch (error) {
        console.error('Signup error:', error);
        // Fallback to original demo behavior if API not available
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'Sign Up';
            alert('Signed up (demo) — now on login');
            window.location.href = 'login.html';
        }, 900);
    }
});

// Enhanced form validation with visual feedback
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.checkValidity()) {
            this.classList.remove('border-red-400');
            this.classList.add('border-green-400');
        } else {
            this.classList.remove('border-green-400');
            this.classList.add('border-red-400');
        }
    });

    // Reset validation styling on focus
    input.addEventListener('focus', function() {
        this.classList.remove('border-red-400', 'border-green-400');
    });
});
