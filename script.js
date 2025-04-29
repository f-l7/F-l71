document.addEventListener('DOMContentLoaded', function() {
    // تحديد الحد الأقصى لتاريخ الميلاد (اليوم الحالي)
    document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];
    
    const submitBtn = document.getElementById('submitBtn');
    const errorDiv = document.getElementById('errorMessage');
    
    submitBtn.addEventListener('click', async function() {
        // 1. جمع البيانات
        const data = {
            name: document.getElementById('name').value.trim(),
            age: document.getElementById('age').value,
            country: document.getElementById('country').value,
            birthdate: document.getElementById('birthdate').value,
            discord: document.getElementById('discord').value.trim()
        };

        // 2. التحقق من البيانات
        if (!validateData(data)) return;

        // 3. تغيير حالة الزر
        toggleLoading(true);
        clearError();

        try {
            // 4. إرسال البيانات
            const success = await sendToDiscord(data);
            
            if (success) {
                showResult('✅ تم إرسال طلبك بنجاح! سيتم المراجعة', 'success');
                document.getElementById('identityForm').reset();
            } else {
                throw new Error('فشل في إرسال البيانات');
            }
        } catch (error) {
            showError(`❌ ${error.message}`);
            console.error(error);
        } finally {
            toggleLoading(false);
        }
    });

    // ========== دوال مساعدة ==========
    function validateData(data) {
        // تحقق من الاسم
        if (!/^[\u0600-\u06FF\s]{3,}$/.test(data.name)) {
            showError('❗ يجب إدخال اسم عربي صحيح (ثلاثي على الأقل)');
            return false;
        }
        
        // تحقق من العمر
        if (data.age < 12 || data.age > 120) {
            showError('❗ العمر يجب أن يكون بين 12 و 120 سنة');
            return false;
        }
        
        // تحقق من البلد
        const allowedCountries = ['لوس سانتوس', 'ساندي شور', 'بليتو'];
        if (!allowedCountries.includes(data.country)) {
            showError('❗ البلد المحدد غير مدعوم حالياً');
            return false;
        }
        
        // تحقق من تاريخ الميلاد
        const birthDate = new Date(data.birthdate);
        const currentDate = new Date();
        if (birthDate > currentDate) {
            showError('❗ تاريخ الميلاد لا يمكن أن يكون في المستقبل');
            return false;
        }
        
        // تحقق من ايدي دسكورد
        if (!/^[^#]+#\d{4}$/.test(data.discord)) {
            showError('❗ اكتب ايدي دسكورد صحيح (مثال: User#1234)');
            return false;
        }
        
        return true;
    }

    async function sendToDiscord(data) {
        const response = await fetch("WEBHOOK_URL_HERE", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                embeds: [{
                    title: "طلب هوية جديد",
                    description: `تم التسجيل بواسطة: ${data.discord}`,
                    fields: [
                        { name: "الاسم", value: data.name },
                        { name: "العمر", value: data.age },
                        { name: "البلد", value: data.country },
                        { name: "تاريخ الميلاد", value: data.birthdate }
                    ],
                    color: 0x245C36,
                    timestamp: new Date()
                }]
            })
        });
        return response.ok;
    }

    function toggleLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.innerHTML = isLoading ? 
            '<span class="loading-spinner"></span> جاري الإرسال...' : 
            'إنشاء الهوية';
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    function clearError() {
        errorDiv.classList.add('hidden');
    }

    function showResult(message, type) {
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = message;
        resultDiv.className = type;
        resultDiv.classList.remove('hidden');
        
        setTimeout(() => {
            resultDiv.classList.add('hidden');
        }, 5000);
    }
});
