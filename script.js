document.addEventListener('DOMContentLoaded', function() {
    // تحديد الحد الأقصى لتاريخ الميلاد (اليوم)
    document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];
    
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) {
        console.error('لم يتم العثور على زر الإرسال!');
        return;
    }

    submitBtn.addEventListener('click', async function() {
        // 1. جمع البيانات
        const formData = {
            name: document.getElementById('fullName').value.trim(),
            age: document.getElementById('age').value,
            country: document.getElementById('country').value,
            birthdate: document.getElementById('birthdate').value,
            discord: document.getElementById('discord').value.trim()
        };

        // 2. التحقق من البيانات
        if (!validateForm(formData)) return;

        // 3. إظهار حالة التحميل
        toggleLoading(true);
        clearMessages();

        try {
            // 4. إرسال البيانات (استبدل الرابط)
            const response = await fetch("WEBHOOK_URL_HERE", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    embeds: [{
                        title: "طلب هوية جديد",
                        description: `تم التسجيل بواسطة: ${formData.discord}`,
                        fields: [
                            { name: "الاسم", value: formData.name || "غير متوفر" },
                            { name: "العمر", value: formData.age || "غير متوفر" },
                            { name: "البلد", value: formData.country || "غير متوفر" },
                            { name: "تاريخ الميلاد", value: formData.birthdate || "غير متوفر" }
                        ],
                        color: 0x245C36,
                        timestamp: new Date()
                    }]
                })
            });

            if (!response.ok) throw new Error('فشل في الإرسال');

            showResult('✅ تم إرسال طلبك بنجاح!', 'success');
            document.getElementById('identityForm').reset();

        } catch (error) {
            console.error('Error:', error);
            showResult(`❌ ${error.message}`, 'error');
        } finally {
            toggleLoading(false);
        }
    });

    // ========== دوال مساعدة ==========
    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.length < 3) {
            errors.push("الاسم يجب أن يحتوي على 3 أحرف على الأقل");
        }
        
        if (!data.age || data.age < 12) {
            errors.push("العمر يجب أن يكون 12 سنة على الأقل");
        }
        
        if (!data.country) {
            errors.push("يجب اختيار البلد");
        }
        
        if (!data.birthdate) {
            errors.push("يجب إدخال تاريخ الميلاد");
        }
        
        if (!data.discord || !data.discord.includes('#')) {
            errors.push("إيدي دسكورد غير صحيح (مثال: User#1234)");
        }
        
        if (errors.length > 0) {
            showResult(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
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

    function showResult(message, type) {
        const resultDiv = document.getElementById('resultMessage');
        resultDiv.innerHTML = message;
        resultDiv.className = type;
        resultDiv.classList.remove('hidden');
    }

    function clearMessages() {
        document.getElementById('resultMessage').classList.add('hidden');
    }
});
