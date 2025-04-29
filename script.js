// تكوين النظام
const CONFIG = {
    DISCORD_WEBHOOK: "https://discord.com/api/webhooks/1366369025986265179/rVX34EBkGn6anyrTz_IMJgBG1Acjr43_raqun2XVkTtpkSeFmygPcYwuL1aebfaQGJp4", // استبدل برابطك
    ADMIN_ROLE_ID: "1366184760283758755" // (اختياري)
};

// عناصر DOM
const elements = {
    form: document.getElementById('identityForm'),
    submitBtn: document.getElementById('submitBtn'),
    loadingSpinner: document.querySelector('.loading-spinner'),
    modal: document.getElementById('successModal')
};

// إرسال النموذج
elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    toggleLoading(true);
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        nationality: document.getElementById('nationality').value,
        birthdate: document.getElementById('birthdate').value,
        discordId: document.getElementById('discordId').value.trim(),
        submissionDate: new Date().toISOString()
    };

    if (!validateForm(formData)) {
        toggleLoading(false);
        return;
    }

    const success = await sendToDiscord(formData);
    
    if (success) {
        showSuccessModal();
        elements.form.reset();
    } else {
        alert("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً");
    }
    
    toggleLoading(false);
});

// التحقق من البيانات
function validateForm(data) {
    if (!data.discordId || !/^[^#]+#\d{4}$/.test(data.discordId)) {
        alert("❗ يرجى إدخال ايدي دسكورد صحيح (مثال: User#1234)");
        return false;
    }
    return true;
}

// إرسال إلى ديسكورد
async function sendToDiscord(data) {
    try {
        const response = await fetch(CONFIG.DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "طلب هوية جديد - FalcoN LiFe",
                    description: `**تم استلام طلب جديد من:** ${data.discordId}`,
                    color: 0x245C36,
                    fields: [
                        { name: "الاسم", value: data.fullName, inline: true },
                        { name: "العمر", value: data.age, inline: true },
                        { name: "الجنس", value: data.gender, inline: true },
                        { name: "الجنسية", value: data.nationality },
                        { name: "تاريخ الميلاد", value: data.birthdate },
                        { name: "وقت الطلب", value: new Date(data.submissionDate).toLocaleString() }
                    ],
                    footer: { 
                        text: "FalcoN LiFe ID System", 
                        icon_url: "https://i.imgur.com/xyz123.png" 
                    }
                }]
            })
        });

        return response.ok;
    } catch (error) {
        console.error("Error sending to Discord:", error);
        return false;
    }
}

// عرض النتيجة
function showSuccessModal() {
    elements.modal.classList.remove('hidden');
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
        elements.modal.classList.add('hidden');
    });
}

// تحميل مؤقت
function toggleLoading(isLoading) {
    if (isLoading) {
        elements.submitBtn.disabled = true;
        elements.loadingSpinner.style.display = 'inline-block';
        document.querySelector('.btn-text').textContent = 'جاري الإرسال...';
    } else {
        elements.submitBtn.disabled = false;
        elements.loadingSpinner.style.display = 'none';
        document.querySelector('.btn-text').textContent = 'إنشاء الهوية';
    }
}

// إغلاق المودال
document.querySelector('.close-modal').addEventListener('click', () => {
    elements.modal.classList.add('hidden');
});

// عرض السنة
document.getElementById('current-year').textContent = new Date().getFullYear();
