// متغيرات النظام
const WEBHOOK_URL = "WEBHOOK_URL_HERE"; // استبدل برابط الويب هوك

// دالة إنشاء الهوية
async function submitForm() {
    const data = {
        name: document.getElementById('name').value.trim(),
        age: document.getElementById('age').value,
        country: document.getElementById('country').value,
        birthdate: document.getElementById('birthdate').value,
        discord: document.getElementById('discord').value.trim(),
        ip: await getIP() // للحصول على IP المستخدم (اختياري)
    };

    // التحقق من البيانات
    if (!validateData(data)) return;

    // إرسال إلى الديسكورد
    const success = await sendToDiscord(data);
    
    if (success) {
        alert("تم إرسال طلبك بنجاح! سيتم مراجعته من قبل المسؤول");
        document.getElementById('identityForm').reset();
    } else {
        alert("حدث خطأ! حاول مرة أخرى لاحقاً");
    }
}

// التحقق من صحة البيانات
function validateData(data) {
    if (!data.discord || !/^.+#\d{4}$/.test(data.discord)) {
        alert("❗ اكتب ايدي دسكورد صحيح (مثال: User#1234)");
        return false;
    }
    return true;
}

// إرسال البيانات إلى الديسكورد
async function sendToDiscord(data) {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: "طلب هوية جديد - يحتاج مراجعة",
                    description: "**تفاصيل الطلب:**",
                    color: 0xFFA500, // لون برتقالي للتنبيه
                    fields: [
                        { name: "الاسم", value: data.name, inline: true },
                        { name: "العمر", value: data.age, inline: true },
                        { name: "البلد", value: data.country, inline: true },
                        { name: "تاريخ الميلاد", value: data.birthdate },
                        { name: "ايدي دسكورد", value: data.discord },
                        { name: "IP", value: data.ip || "غير متاح" }
                    ],
                    timestamp: new Date(),
                    footer: { 
                        text: "FalcoN LiFe ID System", 
                        icon_url: "https://i.imgur.com/ABCD123.png" // استبدل بصورة شعارك
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

// الحصول على IP المستخدم (اختياري)
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return null;
    }
}

// عرض السنة في الفوتر
document.getElementById('year').textContent = new Date().getFullYear();
