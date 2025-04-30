document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('identityForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSpinner = document.getElementById('formSpinner');
    const formMessages = document.getElementById('formMessages');
    const modal = document.getElementById('resultModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        setLoading(true);
        clearMessages();

        if(!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const formData = {
                username: document.getElementById('username').value.trim(),
                discord: document.getElementById('discord').value.trim(),
                birthdate: document.getElementById('birthdate').value,
                age: parseInt(document.getElementById('age').value),
                country: document.getElementById('country').value.trim()
            };

            const response = await submitForm(formData);

            if(response.success) {
                showModal('تم بنجاح', 'تم إرسال طلب الهوية بنجاح وسيتم مراجعته من قبل المسؤولين');
                form.reset();
            } else {
                showError(response.message || 'حدث خطأ أثناء إرسال الطلب');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('حدث خطأ في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    });

    modalCloseBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    function validateForm() {
        const age = parseInt(document.getElementById('age').value);
        const discord = document.getElementById('discord').value;
        let isValid = true;

        if(age < 10 || age > 100) {
            showError('العمر يجب أن يكون بين 10 و 100 سنة');
            isValid = false;
        }

        if(!discord.includes('#')) {
            showError('صيغة ايدي ديسكورد غير صحيحة (يجب أن تحتوي على #)');
            isValid = false;
        }

        return isValid;
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        formSpinner.style.display = isLoading ? 'inline-block' : 'none';
        document.querySelector('.btn-text').style.visibility = isLoading ? 'hidden' : 'visible';
    }

    function clearMessages() {
        formMessages.innerHTML = '';
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formMessages.appendChild(errorDiv);
    }

    function showModal(title, message) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'flex';
    }

    async function submitForm(formData) {
        // محاكاة اتصال بالخادم
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // في الواقع الفعلي:
        // return await fetch('/api/identities', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // }).then(res => res.json());
        
        return { success: true };
    }
});
