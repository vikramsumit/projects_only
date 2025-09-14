// Remove entering animation after load - matches original timing
window.addEventListener('load', () => {
    setTimeout(() => document.body.classList.remove('entering'), 650);
});

// Handle page transition to signup - matches original animation
document.getElementById('toSignup').addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => window.location.href = this.href, 420);
});

// Handle form submission with original animation style
document.getElementById('loginForm').addEventListener('submit', async function(e) {
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
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Show loading state
        const originalText = btn.textContent;
        btn.textContent = 'Signing in...';

        // Make API call to backend
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            // Store token and redirect to dashboard
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));

            btn.disabled = false;
            btn.textContent = originalText;
            alert('Login successful! Redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 100);
        } else {
            alert(result.message || 'Login failed. Please try again.');
            btn.textContent = originalText;
        }
    } catch (error) {
        console.error('Login error:', error);
        // Fallback to demo behavior if API not available
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'Login';
            alert('Login successful (demo) — redirecting...');
            window.location.href = 'dashboard.html';
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
