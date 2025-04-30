document.addEventListener('DOMContentLoaded', function() {
    const idContent = document.getElementById('idContent');
    const idStatus = document.getElementById('idStatus');
    
    // محاكاة بيانات المستخدم (في الواقع سيتم جلبها من الخادم)
    const userId = "user123";
    
    loadIdentity(userId);

    async function loadIdentity(userId) {
        showLoading();
        
        try {
            const identity = await fetchIdentity(userId);
            
            if(identity.error) {
                showError(identity.message);
                return;
            }
            
            if(!identity.exists) {
                showNoIdentity();
                return;
            }
            
            renderIdentity(identity);
        } catch (error) {
            console.error('Error:', error);
            showError('حدث خطأ في جلب بيانات الهوية');
        }
    }

    function renderIdentity(data) {
        let statusText = '';
        let statusClass = '';
        
        switch(data.status) {
            case 'approved':
                statusText = 'معتمدة';
                statusClass = 'approved';
                break;
            case 'pending':
                statusText = 'قيد المراجعة';
                statusClass = 'pending';
                break;
            case 'rejected':
                statusText = `مرفوضة${data.reason ? ': ' + data.reason : ''}`;
                statusClass = 'rejected';
                break;
            default:
                statusText = 'غير معروفة';
                statusClass = 'unknown';
        }
        
        idStatus.innerHTML = `<span class="${statusClass}">${statusText}</span>`;
        
        idContent.innerHTML = `
            <div class="identity-info">
                <div class="info-row">
                    <span class="info-label">رقم الهوية:</span>
                    <span class="info-value">${data.idNumber || '---'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">الاسم:</span>
                    <span class="info-value">${data.username}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">ايدي ديسكورد:</span>
                    <span class="info-value">${data.discord}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">تاريخ الميلاد:</span>
                    <span class="info-value">${data.birthdate}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">العمر:</span>
                    <span class="info-value">${data.age}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">البلد:</span>
                    <span class="info-value">${data.country}</span>
                </div>
            </div>
            
            ${data.status === 'rejected' ? `
            <div class="identity-actions">
                <a href="create_id.html" class="action-btn">تقديم طلب جديد</a>
            </div>
            ` : ''}
        `;
    }

    function showNoIdentity() {
        idContent.innerHTML = `
            <div class="no-identity">
                <p>ليس لديك هوية مسجلة بعد</p>
                <a href="create_id.html" class="action-btn">إنشاء هوية جديدة</a>
            </div>
        `;
    }

    function showError(message) {
        idContent.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <button class="retry-btn" onclick="location.reload()">إعادة المحاولة</button>
            </div>
        `;
    }

    function showLoading() {
        idContent.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>جاري تحميل معلومات الهوية...</p>
            </div>
        `;
    }

    async function fetchIdentity(userId) {
        // محاكاة اتصال بالخادم
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // اختر أي سيناريو تريد تجربته:
        
        // 1. هوية معتمدة
        return {
            exists: true,
            idNumber: 'ID-2023-001',
            username: 'اسم المستخدم',
            discord: 'User#1234',
            birthdate: '01/01/2000',
            age: 23,
            country: 'السعودية',
            status: 'approved'
        };
        
        // 2. هوية قيد المراجعة
        // return {
        //     exists: true,
        //     username: 'اسم المستخدم',
        //     discord: 'User#1234',
        //     birthdate: '01/01/2000',
        //     age: 23,
        //     country: 'السعودية',
        //     status: 'pending'
        // };
        
        // 3. هوية مرفوضة
        // return {
        //     exists: true,
        //     username: 'اسم المستخدم',
        //     discord: 'User#1234',
        //     birthdate: '01/01/2000',
        //     age: 23,
        //     country: 'السعودية',
        //     status: 'rejected',
        //     reason: 'معلومات غير كافية'
        // };
        
        // 4. لا يوجد هوية
        // return {
        //     exists: false,
        //     message: 'ليس لديك هوية مسجلة بعد'
        // };
        
        // 5. خطأ في الخادم
        // return {
        //     error: true,
        //     message: 'حدث خطأ في الخادم'
        // };
    }
});
