async function submitForm() {
    console.log("تم النقر على الزر!");
    
    const data = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        country: document.getElementById('country').value,
        birthdate: document.getElementById('birthdate').value,
        discord: document.getElementById('discord').value
    };

    // تحقق من البيانات
    if (!data.discord || !data.discord.includes('#')) {
        alert("❗ يجب إدخال ايدي دسكورد صحيح (مثال: User#1234)");
        return;
    }

    // عرض حالة التحميل
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = "جاري الإرسال...";

    try {
        const response = await fetch("https://discord.com/api/webhooks/1366369025986265179/rVX34EBkGn6anyrTz_IMJgBG1Acjr43_raqun2XVkTtpkSeFmygPcYwuL1aebfaQGJp4", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: "**طلب جديد**",
                embeds: [{
                    title: "طلب هوية",
                    fields: [
                        { name: "الاسم", value: data.name },
                        { name: "الديسكورد", value: data.discord }
                    ],
                    color: 5814783
                }]
            })
        });

        if (response.ok) {
            alert("✅ تم الإرسال بنجاح للديسكورد!");
        } else {
            throw new Error("فشل الإرسال");
        }
    } catch (error) {
        console.error(error);
        alert("❌ حدث خطأ: " + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = "إنشاء الهوية";
    }
}

// ربط الحدث مباشرة
document.getElementById('submitBtn').addEventListener('click', submitForm);
