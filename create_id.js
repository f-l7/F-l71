document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('idForm');
    const errorContainer = document.getElementById('errorContainer');
    const submitBtn = document.getElementById('submitBtn');
    const modal = document.getElementById('waitingModal');
    const closeModal = document.getElementById('closeModal');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        errorContainer.innerHTML = '';
        
        const age = parseInt(document.getElementById('age').value);
        if(age < 10 || age > 100) {
            showError('العمر يجب أن يكون بين 10 و 100 سنة');
            submitBtn.disabled = false;
            return;
        }
        
        try {
            const response = await fetch('/api/create_id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: document.getElementById('username').value,
                    discord: document.getElementById('discord').value,
                    birthdate: document.getElementById('birthdate').value,
                    age: age,
                    country: document.getElementById('country').value
                })
            });

            const data = await response.json();
            
            if(!response.ok) {
                throw new Error(data.message || 'حدث خطأ أثناء إرسال الطلب');
            }
            
            if(data.success) {
                modal.style.display = 'flex';
            } else {
                showError(data.message || 'حدث خطأ أثناء إرسال الطلب');
            }
        } catch (error) {
            showError(error.message);
            console.error('Error:', error);
        } finally {
            submitBtn.disabled = false;
        }
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        form.reset();
    });

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorContainer.appendChild(errorDiv);
    }
});
