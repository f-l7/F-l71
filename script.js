document.addEventListener('DOMContentLoaded', function() {
    // تحديد الحد الأقصى لتاريخ الميلاد (اليوم)
    document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];
    
    const submitBtn = document.getElementById('submitBtn');
    const WEBHOOK_URL = "WEBHOOK_URL_HERE"; // استبدل برابطك

    submitBtn.addEventListener('click', async function() {
        // 1. جمع البيانات
        const formData = {
            name: document.getElementById('name').value.trim(),
            age: document.getElementById('age').value,
            country: document.getElementById('country').value,
            birthdate: document.getElementById('birthdate').value,
            discord: document.getElementById('discord').value.trim(),
            ip: await getIP() // إضافة IP للتحقق
        };

        // 2. التحقق من البيانات
        if (!validateForm(formData)) return;

        // 3. إظهار حالة التحميل
        toggleLoading(true);
        clearMessages();

        try {
            // 4. إرسال البيانات إلى الديسكورد
            const response = await fetchWithTimeout(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: "طلب هوية جديد",
                        description: `تم التسجيل بواسطة: ${formData.discord}`,
                        fields: [
                            { name: "الاسم", value: formData.name || "غير متوفر" },
                            { name: "العمر", value: formData.age || "غير متوفر" },
                            { name: "البلد", value: formData.country || "غير متوفر" },
                            { name: "تاريخ الميلاد", value: formData.birthdate || "غير متوفر" },
                            { name: "IP المستخدم", value: formData.ip || "غير معروف" }
                        ],
                        color: 0x245C36,
                        timestamp: new Date().toISOString()
                    }]
                })
            }, 10000); // مهلة 10 ثواني

            // 5. معالجة الاستجابة
            if (!response.ok) {
                throw new Error(`خطأ في السيرفر: ${response.status}`);
            }

            showSuccess('تم إرسال طلبك بنجاح! سيتم المراجعة');
            document.getElementById('identityForm').reset();

        } catch (error) {
            console.error('Error:', error);
            showError(`فشل الإرسال: ${error.message}`);
        } finally {
            toggleLoading(false);
        }
    });

    // ========== دوال مساعدة ==========
    async function getIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return null;
        }
    }

    function validateForm(data) {
        const errors = [];
        
        if (!/^[\u0600-\u06FF\s]{3,}$/.test(data.name)) {
            errors.push("يجب إدخال اسم عربي صحيح (ثلاثي على الأقل)");
        }
        
        if (data.age < 12 || data.age > 120) {
            errors.push("العمر يجب أن يكون بين 12 و120 سنة");
        }
        
        if (!data.country) {
            errors.push("يجب اختيار البلد");
        }
        
        if (!data.birthdate) {
            errors.push("يجب إدخال تاريخ الميلاد");
        } else if (new Date(data.birthdate) > new Date()) {
            errors.push("تاريخ الميلاد لا يمكن أن يكون في المستقبل");
        }
        
        if (!/^[^#]+#\d{4}$/.test(data.discord)) {
            errors.push("إيدي دسكورد غير صحيح (يجب أن يكون بالشكل: User#1234)");
        }
        
        if (errors.length > 0) {
            showError(errors.join('<br>'));
            return false;
        }
        
        return true;
    }

    async function fetchWithTimeout(url, options, timeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('تجاوز الوقت المحدد للإرسال');
            }
            throw error;
        }
    }

    function toggleLoading(show) {
        const loader = document.getElementById('loader');
        const btnText = document.getElementById('btnText');
        
        if (show) {
            loader.classList.remove('hidden');
            btnText.textContent = 'جاري الإرسال...';
            submitBtn.disabled = true;
        } else {
            loader.classList.add('hidden');
            btnText.textContent = 'إنشاء الهوية';
            submitBtn.disabled = false;
        }
    }

    function showError(message) {
        const errorDiv = document.getElementById('errorMsg');
        errorDiv.innerHTML = message;
        errorDiv.classList.remove('hidden');
    }

    function showSuccess(message) {
        const successDiv = document.getElementById('successMsg');
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
    }

    function clearMessages() {
        document.getElementById('errorMsg').classList.add('hidden');
        document.getElementById('successMsg').classList.add('hidden');
    }
});
