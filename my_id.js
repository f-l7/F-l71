document.addEventListener('DOMContentLoaded', function() {
    const idContent = document.getElementById('idContent');
    
    // في الواقع الفعلي، سيتم الحصول على معرف الديسكورد من نظام المصادقة
    const discordId = "current_user_discord_id"; 
    
    fetchIdData(discordId);

    async function fetchIdData(discordId) {
        idContent.innerHTML = '<p>جاري تحميل معلومات الهوية...</p>';
        
        try {
            const response = await fetch(`/api/my_id?discord=${discordId}`);
            const data = await response.json();
            
            if(!response.ok) {
                throw new Error(data.message || 'حدث خطأ في الخادم');
            }
            
            if(data.error) {
                showError(data.message);
                return;
            }
            
            if(data.hasId) {
                renderIdCard(data);
            } else {
                showNoIdMessage(data.message);
            }
        } catch (error) {
            showError(error.message);
            console.error('Error:', error);
        }
    }

    function renderIdCard(data) {
        idContent.innerHTML = `
            <div class="id-info"><span class="id-label">رقم الهوية:</span> ${data.idNumber || '---'}</div>
            <div class="id-info"><span class="id-label">الاسم:</span> ${data.username}</div>
            <div class="id-info"><span class="id-label">ايدي ديسكورد:</span> ${data.discord}</div>
            <div class="id-info"><span class="id-label">تاريخ الميلاد:</span> ${data.birthdate}</div>
            <div class="id-info"><span class="id-label">العمر:</span> ${data.age}</div>
            <div class="id-info"><span class="id-label">البلد:</span> ${data.country}</div>
            ${data.status === 'rejected' ? `<div class="error-message">تم رفض طلبك: ${data.reason || 'لا يوجد سبب محدد'}</div>` : ''}
            ${data.status === 'pending' ? `<div class="pending-message">طلبك قيد المراجعة</div>` : ''}
        `;
    }

    function showNoIdMessage(message) {
        idContent.innerHTML = `
            <div class="info-message">${message || 'ليس لديك هوية مسجلة بعد'}</div>
            <a href="create_id.html" class="btn">إنشاء هوية جديدة</a>
        `;
    }

    function showError(message) {
        idContent.innerHTML = `
            <div class="error-message">${message || 'حدث خطأ أثناء جلب بيانات الهوية'}</div>
            <button onclick="location.reload()" class="btn">إعادة المحاولة</button>
        `;
    }
});
