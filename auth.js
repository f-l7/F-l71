// تكامل OAuth مع Discord
document.getElementById('discordLogin').addEventListener('click', () => {
    const clientId = '1365741528378773626';
    const redirectUri = encodeURIComponent('https://f-l7.github.io/F-l7/');
    const scope = encodeURIComponent('identify email');
    
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
});

// معالجة رمز المصادقة
async function handleAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        try {
            const response = await fetch('/api/auth/discord', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            
            const data = await response.json();
            localStorage.setItem('discord_user', JSON.stringify(data.user));
            showIdentityForm();
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// عرض نموذج الهوية بعد التسجيل
function showIdentityForm() {
    document.body.innerHTML = `
        <div class="container">
            <h2>إنشاء هوية جديدة</h2>
            <form id="identityForm">
                <input type="text" id="username" placeholder="ايديك" required>
                <input type="text" id="name" placeholder="اسمك" required>
                <input type="number" id="age" placeholder="عمرك" required>
                <select id="country" required>
                    <option value="">اختر بلدك</option>
                    <option value="السعودية">السعودية</option>
                </select>
                <input type="date" id="birthdate" required>
                <button type="button" onclick="submitForm()" class="btn">إنشاء هوية</button>
            </form>
        </div>
    `;
}

// إرسال البيانات
async function submitForm() {
    const user = JSON.parse(localStorage.getItem('discord_user'));
    const formData = {
        discordId: user.id,
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        country: document.getElementById('country').value,
        birthdate: document.getElementById('birthdate').value
    };
    
    // إرسال إلى الويب هوك
    await sendToWebhook(formData);
    
    // عرض بطاقة الهوية
    showIdCard(formData);
}

// إرسال إلى ويب هوك الديسكورد
async function sendToWebhook(data) {
    const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';
    
    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [{
                title: "طلب هوية جديد",
                fields: [
                    { name: "اسم المستخدم", value: data.name },
                    { name: "العمر", value: data.age },
                    { name: "البلد", value: data.country },
                    { name: "تاريخ الميلاد", value: data.birthdate }
                ]
            }]
        })
    });
}

// عرض بطاقة الهوية مع أزرار القبول/الرفض
function showIdCard(data) {
    document.body.innerHTML += `
        <div id="idCard">
            <h3>هويتك الرقمية</h3>
            <p>الاسم: ${data.name}</p>
            <p>العمر: ${data.age}</p>
            <p>البلد: ${data.country}</p>
            <p>تاريخ الميلاد: ${data.birthdate}</p>
            
            <div class="actions">
                <button onclick="approveId()" class="btn accept">قبول</button>
                <button onclick="rejectId()" class="btn reject">رفض</button>
            </div>
        </div>
    `;
}

// معالجة القبول
function approveId() {
    alert('تم قبول الهوية بنجاح!');
    generateIdCard();
}

// معالجة الرفض
function rejectId() {
    if(confirm('هل أنت متأكد من رفض الهوية؟')) {
        alert('تم رفض الهوية');
        showIdentityForm();
    }
}

// توليد صورة الهوية
function generateIdCard() {
    // يمكنك استخدام html2canvas لإنشاء صورة
    console.log('تم إنشاء الهوية');
}

// بدء التشغيل
handleAuth();
