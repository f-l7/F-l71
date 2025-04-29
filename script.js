document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    
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
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';

        try {
            // 4. إرسال البيانات
            const success = await sendToDiscord(data);
            
            if (success) {
                showResult('✅ تم إرسال طلبك بنجاح! سيتم المراجعة', 'success');
                document.getElementById('identityForm').reset();
            } else {
                throw new Error('فشل في الإرسال');
            }
        } catch (error) {
            showResult(`❌ حدث خطأ: ${error.message}`, 'error');
            console.error(error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'إنشاء الهوية';
        }
    });

    // دوال مساعدة
    function validateData(data) {
        if (!data.discord || !/^[^#]+#\d{4}$/.test(data.discord)) {
            alert('❗ اكتب ايدي دسكورد صحيح (مثال: User#1234)');
            return false;
        }
        return true;
    }

    async function sendToDiscord(data) {
        const response = await fetch("https://discord.com/api/webhooks/1366369025986265179/rVX34EBkGn6anyrTz_IMJgBG1Acjr43_raqun2XVkTtpkSeFmygPcYwuL1aebfaQGJp4", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                embeds: [{
                    title: "طلب هوية جديد",
                    description: `تم التسجيل بواسطة: ${data.discord}`,
                    fields: [
                        { name: "الاسم", value: data.name },
                        { name: "العمر", value: data.age },
                        { name: "البلد", value: data.country }
                    ],
                    color: 0x245C36,
                    timestamp: new Date()
                }]
            })
        });
        return response.ok;
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
