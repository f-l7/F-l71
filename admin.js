document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    const loginBtn = document.getElementById('loginBtn');
    const errorContainer = document.getElementById('adminError');
    
    // كلمة مرور المسؤولين
    const ADMIN_CREDENTIALS = {
        username: "admin",
        password: "admin123"
    };

    loginBtn.addEventListener('click', function() {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        if(username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            loginForm.style.display = 'none';
            adminPanel.style.display = 'block';
            loadAdminPanel();
        } else {
            showError('بيانات الدخول غير صحيحة');
        }
    });

    async function loadAdminPanel() {
        try {
            // جلب بيانات المسؤول
            const adminInfo = await fetchAdminInfo();
            document.getElementById('adminInfo').innerHTML = `
                <p>مرحباً ${adminInfo.username} (${adminInfo.discord})</p>
            `;
            
            // جلب طلبات الهويات
            const pendingRequests = await fetchPendingRequests();
            renderPendingRequests(pendingRequests);
            
            // جلب جميع الهويات
            const allIds = await fetchAllIds();
            renderAllIds(allIds);
            
        } catch (error) {
            console.error('Error loading admin panel:', error);
            showError('حدث خطأ أثناء تحميل لوحة التحكم');
        }
    }

    function showError(message) {
        errorContainer.innerHTML = `
            <div class="error-message">${message}</div>
        `;
    }

    // الوظائف المساعدة للاتصال بالخادم
    async function fetchAdminInfo() {
        const response = await fetch('/api/admin_info');
        return await response.json();
    }

    async function fetchPendingRequests() {
        const response = await fetch('/api/pending_requests');
        return await response.json();
    }

    async function fetchAllIds() {
        const response = await fetch('/api/all_ids');
        return await response.json();
    }

    function renderPendingRequests(requests) {
        const container = document.getElementById('pendingRequests');
        if(requests.length === 0) {
            container.innerHTML = '<p>لا توجد طلبات جديدة</p>';
            return;
        }
        
        let html = '';
        requests.forEach(request => {
            html += `
                <div class="request-card">
                    <h4>طلب جديد من ${request.username}</h4>
                    <p>الديسكورد: ${request.discord}</p>
                    <p>العمر: ${request.age}</p>
                    <p>البلد: ${request.country}</p>
                    <div class="request-actions">
                        <button class="btn approve-btn" data-id="${request.id}">قبول</button>
                        <button class="btn reject-btn" data-id="${request.id}">رفض</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // إضافة معالجات الأحداث للأزرار
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const requestId = this.getAttribute('data-id');
                await processRequest(requestId, 'approve');
            });
        });
        
        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const requestId = this.getAttribute('data-id');
                await processRequest(requestId, 'reject');
            });
        });
    }

    async function processRequest(requestId, action) {
        try {
            const response = await fetch(`/api/process_request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId,
                    action
                })
            });
            
            const data = await response.json();
            
            if(!response.ok) {
                throw new Error(data.message || 'حدث خطأ أثناء المعالجة');
            }
            
            if(data.success) {
                alert(`تم ${action === 'approve' ? 'قبول' : 'رفض'} الطلب بنجاح`);
                loadAdminPanel(); // تحديث البيانات
            }
        } catch (error) {
            alert(error.message);
            console.error('Error processing request:', error);
        }
    }

    function renderAllIds(ids) {
        const container = document.getElementById('idsList');
        if(ids.length === 0) {
            container.innerHTML = '<p>لا توجد هويات مسجلة</p>';
            return;
        }
        
        let html = '<div class="ids-grid">';
        ids.forEach(id => {
            html += `
                <div class="id-card">
                    <h4>${id.username} (${id.idNumber})</h4>
                    <p>الديسكورد: ${id.discord}</p>
                    <p>العمر: ${id.age}</p>
                    <p>البلد: ${id.country}</p>
                    <div class="id-actions">
                        <button class="btn edit-btn" data-id="${id.idNumber}">تعديل</button>
                        <button class="btn delete-btn" data-id="${id.idNumber}">حذف</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
        
        // إضافة معالجات الأحداث للأزرار
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idNumber = this.getAttribute('data-id');
                editId(idNumber);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idNumber = this.getAttribute('data-id');
                deleteId(idNumber);
            });
        });
    }

    async function editId(idNumber) {
        const newUsername = prompt('أدخل الاسم الجديد:');
        if(newUsername) {
            try {
                const response = await fetch(`/api/update_id`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idNumber,
                        username: newUsername
                    })
                });
                
                const data = await response.json();
                
                if(!response.ok) {
                    throw new Error(data.message || 'حدث خطأ أثناء التعديل');
                }
                
                if(data.success) {
                    alert('تم تحديث الهوية بنجاح');
                    loadAdminPanel(); // تحديث البيانات
                }
            } catch (error) {
                alert(error.message);
                console.error('Error editing ID:', error);
            }
        }
    }

    async function deleteId(idNumber) {
        const reason = prompt('أدخل سبب الحذف:');
        if(reason) {
            try {
                const response = await fetch(`/api/delete_id`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idNumber,
                        reason
                    })
                });
                
                const data = await response.json();
                
                if(!response.ok) {
                    throw new Error(data.message || 'حدث خطأ أثناء الحذف');
                }
                
                if(data.success) {
                    alert('تم حذف الهوية بنجاح');
                    loadAdminPanel(); // تحديث البيانات
                }
            } catch (error) {
                alert(error.message);
                console.error('Error deleting ID:', error);
            }
        }
    }
});
