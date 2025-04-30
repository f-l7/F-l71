document.addEventListener('DOMContentLoaded', function() {
    // بيانات المسؤول
    const ADMIN_CREDENTIALS = {
        username: "admin",
        password: "admin123"
    };
    
    // عناصر DOM
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('adminLoginForm');
    const loginMessages = document.getElementById('loginMessages');
    const adminName = document.getElementById('adminName');
    const logoutBtn = document.getElementById('logoutBtn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const actionModal = document.getElementById('actionModal');
    const actionModalTitle = document.getElementById('actionModalTitle');
    const actionModalBody = document.getElementById('actionModalBody');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    const cancelActionBtn = document.getElementById('cancelActionBtn');
    
    // متغيرات الحالة
    let currentAdmin = null;
    let currentAction = null;
    let currentItemId = null;
    
    // تهيئة الصفحة
    init();
    
    // معالجة تسجيل الدخول
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;
        
        if(username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            loginSuccess(username);
        } else {
            showLoginError('بيانات الدخول غير صحيحة');
        }
    });
    
    // معالجة تسجيل الخروج
    logoutBtn.addEventListener('click', logout);
    
    // معالجة تغيير التبويبات
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // معالجة الأحداث في المشرف
    confirmActionBtn.addEventListener('click', handleConfirmAction);
    cancelActionBtn.addEventListener('click', closeActionModal);
    
    // وظائف التهيئة
    function init() {
        adminPanel.style.display = 'none';
        switchTab('pending');
        loadMockData();
    }
    
    function loginSuccess(username) {
        currentAdmin = username;
        adminName.textContent = username;
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
    }
    
    function logout() {
        currentAdmin = null;
        adminPanel.style.display = 'none';
        loginSection.style.display = 'block';
        loginForm.reset();
    }
    
    function showLoginError(message) {
        loginMessages.innerHTML = `
            <div class="error-message">${message}</div>
        `;
    }
    
    function switchTab(tabId) {
        // تحديث أزرار التبويب
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-tab') === tabId);
        });
        
        // تحديث محتوى التبويب
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}Tab`);
        });
    }
    
    function loadMockData() {
        // طلبات معلقة وهمية
        const pendingRequests = [
            {
                id: 'req1',
                username: 'مستخدم 1',
                discord: 'User1#1234',
                age: 25,
                country: 'السعودية',
                date: '2023-05-01'
            },
            {
                id: 'req2',
                username: 'مستخدم 2',
                discord: 'User2#5678',
                age: 30,
                country: 'مصر',
                date: '2023-05-02'
            }
        ];
        
        // هويات معتمدة وهمية
        const approvedIds = [
            {
                id: 'id1',
                idNumber: 'ID-2023-001',
                username: 'مستخدم معتمد 1',
                discord: 'Approved1#1234',
                age: 22,
                country: 'الكويت',
                date: '2023-04-15'
            }
        ];
        
        // طلبات مرفوضة وهمية
        const rejectedRequests = [
            {
                id: 'rej1',
                username: 'مستخدم مرفوض 1',
                discord: 'Rejected1#1234',
                age: 17,
                country: 'الإمارات',
                date: '2023-04-20',
                reason: 'العمر أقل من المسموح'
            }
        ];
        
        renderPendingRequests(pendingRequests);
        renderApprovedIds(approvedIds);
        renderRejectedRequests(rejectedRequests);
    }
    
    function renderPendingRequests(requests) {
        const container = document.getElementById('pendingRequests');
        
        if(requests.length === 0) {
            container.innerHTML = '<p class="no-data">لا توجد طلبات معلقة</p>';
            return;
        }
        
        let html = '';
        requests.forEach(request => {
            html += `
                <div class="request-card" data-id="${request.id}">
                    <div class="request-header">
                        <h4>${request.username}</h4>
                        <span class="request-date">${request.date}</span>
                    </div>
                    <div class="request-details">
                        <p><strong>الديسكورد:</strong> ${request.discord}</p>
                        <p><strong>العمر:</strong> ${request.age}</p>
                        <p><strong>البلد:</strong> ${request.country}</p>
                    </div>
                    <div class="request-actions">
                        <button class="action-btn approve-btn" data-id="${request.id}">قبول</button>
                        <button class="action-btn reject-btn" data-id="${request.id}">رفض</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // إضافة معالجات الأحداث للأزرار
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                showActionModal('قبول الطلب', 'هل أنت متأكد من قبول هذا الطلب؟', 'approve', requestId);
            });
        });
        
        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = this.getAttribute('data-id');
                showActionModal('رفض الطلب', 'الرجاء إدخال سبب الرفض:', 'reject', requestId, true);
            });
        });
    }
    
    function renderApprovedIds(ids) {
        const container = document.getElementById('approvedIds');
        
        if(ids.length === 0) {
            container.innerHTML = '<p class="no-data">لا توجد هويات معتمدة</p>';
            return;
        }
        
        let html = '';
        ids.forEach(id => {
            html += `
                <div class="id-card" data-id="${id.id}">
                    <div class="id-header">
                        <h4>${id.username}</h4>
                        <span class="id-number">${id.idNumber}</span>
                    </div>
                    <div class="id-details">
                        <p><strong>الديسكورد:</strong> ${id.discord}</p>
                        <p><strong>العمر:</strong> ${id.age}</p>
                        <p><strong>البلد:</strong> ${id.country}</p>
                        <p><strong>تاريخ الاعتماد:</strong> ${id.date}</p>
                    </div>
                    <div class="id-actions">
                        <button class="action-btn edit-btn" data-id="${id.id}">تعديل</button>
                        <button class="action-btn delete-btn" data-id="${id.id}">حذف</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // إضافة معالجات الأحداث للأزرار
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                showEditModal(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                showActionModal('حذف الهوية', 'هل أنت متأكد من حذف هذه الهوية؟', 'delete', id);
            });
        });
    }
    
    function renderRejectedRequests(requests) {
        const container = document.getElementById('rejectedRequests');
        
        if(requests.length === 0) {
            container.innerHTML = '<p class="no-data">لا توجد طلبات مرفوضة</p>';
            return;
        }
        
        let html = '';
        requests.forEach(request => {
            html += `
                <div class="request-card rejected" data-id="${request.id}">
                    <div class="request-header">
                        <h4>${request.username}</h4>
                        <span class="request-date">${request.date}</span>
                    </div>
                    <div class="request-details">
                        <p><strong>الديسكورد:</strong> ${request.discord}</p>
                        <p><strong>العمر:</strong> ${request.age}</p>
                        <p><strong>البلد:</strong> ${request.country}</p>
                        <p><strong>سبب الرفض:</strong> ${request.reason}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    function showActionModal(title, message, action, itemId, showInput = false) {
        currentAction = action;
        currentItemId = itemId;
        
        actionModalTitle.textContent = title;
        
        if(showInput) {
            actionModalBody.innerHTML = `
                <p>${message}</p>
                <textarea id="reasonInput" placeholder="أدخل سبب الرفض..." rows="3"></textarea>
            `;
        } else {
            actionModalBody.innerHTML = `<p>${message}</p>`;
        }
        
        actionModal.style.display = 'flex';
    }
    
    function showEditModal(id) {
        // في الواقع الفعلي، سيتم جلب بيانات الهوية من الخادم
        const idData = {
            username: 'اسم المستخدم الحالي',
            discord: 'User#1234',
            age: 25,
            country: 'السعودية'
        };
        
        actionModalTitle.textContent = 'تعديل الهوية';
        actionModalBody.innerHTML = `
            <div class="edit-form">
                <div class="form-group">
                    <label for="editUsername">الاسم:</label>
                    <input type="text" id="editUsername" value="${idData.username}">
                </div>
                <div class="form-group">
                    <label for="editDiscord">ايدي ديسكورد:</label>
                    <input type="text" id="editDiscord" value="${idData.discord}">
                </div>
                <div class="form-group">
                    <label for="editAge">العمر:</label>
                    <input type="number" id="editAge" value="${idData.age}">
                </div>
                <div class="form-group">
                    <label for="editCountry">البلد:</label>
                    <input type="text" id="editCountry" value="${idData.country}">
                </div>
            </div>
        `;
        
        currentAction = 'edit';
        currentItemId = id;
        actionModal.style.display = 'flex';
    }
    
    function closeActionModal() {
        actionModal.style.display = 'none';
        currentAction = null;
        currentItemId = null;
    }
    
    function handleConfirmAction() {
        let reason = '';
        
        if(currentAction === 'reject') {
            const reasonInput = document.getElementById('reasonInput');
            if(!reasonInput.value.trim()) {
                alert('الرجاء إدخال سبب الرفض');
                return;
            }
            reason = reasonInput.value;
        }
        
        // في الواقع الفعلي، سيتم هنا إرسال الإجراء إلى الخادم
        console.log(`تنفيذ الإجراء: ${currentAction} على العنصر: ${currentItemId}`, reason ? `بسبب: ${reason}` : '');
        
        // محاكاة نجاح الإجراء
        alert(`تم ${currentAction === 'approve' ? 'قبول' : currentAction === 'reject' ? 'رفض' : 'حذف'} الطلب بنجاح`);
        
        closeActionModal();
        // إعادة تحميل البيانات
        loadMockData();
    }
});
