// تحديث السنة تلقائياً
document.getElementById('year').textContent = new Date().getFullYear();

// دالة إنشاء الهوية
function submitForm() {
    const data = {
        name: document.getElementById('name').value.trim(),
        age: document.getElementById('age').value,
        country: document.getElementById('country').value,
        birthdate: document.getElementById('birthdate').value,
        discord: document.getElementById('discord').value.trim()
    };

    // التحقق من البيانات
    if (!validateData(data)) return;

    // إرسال البيانات (مثال باستخدام ويب هوك)
    sendToDiscord(data);
    
    // عرض بطاقة الهوية
    showIDCard(data);
}

// التحقق من صحة البيانات
function validateData(data) {
    if (!data.discord || !data.discord.includes('#')) {
        alert('❗ يجب إدخال ايدي دسكورد صالح (مثال: User#1234)');
        return false;
    }
    
    if (!data.name || data.name.length < 3) {
        alert('❗ الاسم يجب أن يكون أكثر من 3 أحرف');
        return false;
    }
    
    return true;
}

// إرسال إلى ديسكورد
async function sendToDiscord(data) {
    const webhookUrl = "https://discord.com/api/webhooks/1366369025986265179/rVX34EBkGn6anyrTz_IMJgBG1Acjr43_raqun2XVkTtpkSeFmygPcYwuL1aebfaQGJp4"; // استبدل برابط الويب هوك
    
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
                        { name: "البلد", value: data.country, inline: true },
                        { name: "تاريخ الميلاد", value: data.birthdate },
                        { name: "ايدي دسكورد", value: data.discord }
                    ],
                    timestamp: new Date(),
                    footer: { text: "FalcoN LiFe ID System" }
                }]
            })
        });
        
        if (!response.ok) throw new Error('فشل الإرسال');
    } catch (error) {
        console.error('Error:', error);
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
    alert('✅ تم قبول الهوية بنجاح');
    // هنا يمكنك إضافة كود لإنشاء صورة الهوية
}

// رفض الهوية
function rejectID() {
    if (confirm('⚠️ هل أنت متأكد من رفض هذه الهوية؟')) {
        document.getElementById('idCard').classList.add('hidden');
        document.getElementById('identityForm').reset();
    }
}
