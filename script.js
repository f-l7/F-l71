// دالة إنشاء الهوية
function submitForm() {
    // جمع البيانات من النموذج
    const formData = {
        name: document.getElementById('name').value.trim(),
        age: document.getElementById('age').value,
        country: document.getElementById('country').value,
        birthdate: document.getElementById('birthdate').value,
        discord: document.getElementById('discord').value.trim()
    };

    // التحقق من البيانات
    if (!validateForm(formData)) return;

    // إرسال البيانات إلى ويب هوك دسكورد
    sendToDiscord(formData);

    // عرض بطاقة الهوية
    showIDCard(formData);
}

// التحقق من صحة البيانات
function validateForm(data) {
    if (!data.name || data.name.length < 3) {
        alert('⚠️ الاسم يجب أن يحتوي على 3 أحرف على الأقل');
        return false;
    }

    if (!data.discord || !data.discord.includes('#')) {
        alert('⚠️ يجب إدخال ايدي دسكورد صالح (مثال: User#1234)');
        return false;
    }

    if (!data.country) {
        alert('⚠️ يرجى اختيار الجنسية');
        return false;
    }

    return true;
}

// إرسال البيانات إلى دسكورد
async function sendToDiscord(data) {
    const webhookUrl = "YOUR_DISCORD_WEBHOOK_URL"; // استبدل برابط الويب هوك

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "طلب هوية جديد | FalcoN LiFe",
                    color: 0x245C36,
                    fields: [
                        { name: "الاسم", value: data.name, inline: true },
                        { name: "العمر", value: data.age, inline: true },
                        { name: "الجنسية", value: data.country, inline: true },
                        { name: "تاريخ الميلاد", value: data.birthdate },
                        { name: "ايدي دسكورد", value: data.discord }
                    ],
                    timestamp: new Date(),
                    footer: { text: "FalcoN LiFe ID System" }
                }]
            })
        });

        if (!response.ok) throw new Error('فشل في الإرسال');
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}

// عرض بطاقة الهوية
function showIDCard(data) {
    document.getElementById('idName').textContent = data.name;
    document.getElementById('idAge').textContent = data.age;
    document.getElementById('idCountry').textContent = data.country;
    document.getElementById('idBirthdate').textContent = data.birthdate;
    document.getElementById('idDiscord').textContent = data.discord;

    document.getElementById('idCard').classList.remove('hidden');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// الموافقة على الهوية
function approveID() {
    alert('✅ تم قبول الهوية بنجاح!\nسيتم الآن إنشاء البطاقة الرقمية');
    // هنا يمكنك إضافة كود لإنشاء صورة الهوية
}

// رفض الهوية
function rejectID() {
    if (confirm('⚠️ هل أنت متأكد من رفض هذه الهوية؟')) {
        document.getElementById('idCard').classList.add('hidden');
        document.getElementById('identityForm').reset();
    }
}

// عرض السنة الحالية في الفوتر
document.getElementById('year').textContent = new Date().getFullYear();
