// تأكد من تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    
    submitBtn.addEventListener('click', async () => {
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

        // 3. تغيير حالة الزر
        toggleLoading(true);

        try {
            // 4. إرسال البيانات
            const success = await sendToDiscord(formData);
            
            if (success) {
                showSuccessMessage();
                document.getElementById('identityForm').reset();
            } else {
                throw new Error('فشل الإرسال');
            }
        } catch (error) {
            alert(`❌ حدث خطأ: ${error.message}`);
        } finally {
            toggleLoading(false);
        }
    });

    // دوال مساعدة
    function validateForm(data) {
        if (!data.discord || !data.discord.includes('#')) {
            alert('❗ اكتب ايدي دسكورد صحيح (مثال: User#1234)');
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
                    color: 0x245C36,
                    fields: [
                        { name: "الاسم", value: data.name },
                        { name: "الديسكورد", value: data.discord },
                        { name: "البلد", value: data.country }
                    ],
                    timestamp: new Date()
                }]
            })
        });
        return response.ok;
    }

    function toggleLoading(isLoading) {
        const btnText = document.querySelector('.button-text');
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = 'جاري الإرسال...';
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'إنشاء الهوية';
        }
    }

    function showSuccessMessage() {
        alert('✅ تم إرسال طلبك بنجاح! سيتم المراجعة');
    }
});
