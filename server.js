const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// قاعدة بيانات وهمية
let idRequests = [];
let approvedIds = [];
let idCounter = 1;

// API Endpoints
app.post('/api/create_id', (req, res) => {
    try {
        const { username, discord, birthdate, age, country } = req.body;
        
        if(!username || !discord || !birthdate || !age || !country) {
            return res.status(400).json({ 
                success: false, 
                message: 'جميع الحقول مطلوبة' 
            });
        }
        
        const newRequest = {
            id: Date.now(),
            username,
            discord,
            birthdate,
            age,
            country,
            status: 'pending'
        };
        
        idRequests.push(newRequest);
        
        // في الواقع الفعلي، سيتم إرسال إشعار للمسؤولين هنا
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error in create_id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'حدث خطأ في الخادم' 
        });
    }
});

app.get('/api/my_id', (req, res) => {
    try {
        const discordId = req.query.discord;
        
        if(!discordId) {
            return res.status(400).json({ 
                error: true, 
                message: 'معرف الديسكورد مطلوب' 
            });
        }
        
        const userApprovedId = approvedIds.find(id => id.discord === discordId);
        
        if(userApprovedId) {
            return res.json({
                hasId: true,
                ...userApprovedId
            });
        }
        
        const userRequest = idRequests.find(req => req.discord === discordId);
        
        if(userRequest) {
            return res.json({
                hasId: false,
                status: userRequest.status,
                message: userRequest.status === 'pending' ? 
                    'طلبك قيد المراجعة' : 
                    `تم رفض طلبك: ${userRequest.reason || 'لا يوجد سبب محدد'}`
            });
        }
        
        res.json({ 
            hasId: false,
            message: 'ليس لديك هوية مسجلة بعد'
        });
    } catch (error) {
        console.error('Error in my_id:', error);
        res.status(500).json({ 
            error: true, 
            message: 'حدث خطأ في الخادم' 
        });
    }
});

app.get('/api/admin_info', (req, res) => {
    res.json({
        username: "admin",
        discord: "admin#1234"
    });
});

app.get('/api/pending_requests', (req, res) => {
    res.json(idRequests.filter(req => req.status === 'pending'));
});

app.get('/api/all_ids', (req, res) => {
    res.json(approvedIds);
});

app.post('/api/process_request', (req, res) => {
    try {
        const { requestId, action } = req.body;
        const requestIndex = idRequests.findIndex(req => req.id == requestId);
        
        if(requestIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'الطلب غير موجود' 
            });
        }
        
        const request = idRequests[requestIndex];
        
        if(action === 'approve') {
            // إنشاء هوية جديدة
            const newId = {
                idNumber: `ID-${idCounter++}`,
                ...request
            };
            approvedIds.push(newId);
            
            // تحديث حالة الطلب
            idRequests[requestIndex].status = 'approved';
            
            // في الواقع الفعلي، سيتم إرسال إشعار للمستخدم هنا
            
            res.json({ 
                success: true,
                message: 'تم قبول الطلب وإنشاء الهوية'
            });
        } else if(action === 'reject') {
            // تحديث حالة الطلب
            idRequests[requestIndex].status = 'rejected';
            idRequests[requestIndex].reason = req.body.reason || 'تم الرفض من قبل المسؤول';
            
            // في الواقع الفعلي، سيتم إرسال إشعار للمستخدم هنا
            
            res.json({ 
                success: true,
                message: 'تم رفض الطلب'
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: 'إجراء غير معروف' 
            });
        }
    } catch (error) {
        console.error('Error in process_request:', error);
        res.status(500).json({ 
            success: false, 
            message: 'حدث خطأ في الخادم' 
        });
    }
});

app.post('/api/update_id', (req, res) => {
    try {
        const { idNumber, username } = req.body;
        const idIndex = approvedIds.findIndex(id => id.idNumber === idNumber);
        
        if(idIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'الهوية غير موجودة' 
            });
        }
        
        approvedIds[idIndex].username = username;
        
        res.json({ 
            success: true,
            message: 'تم تحديث الهوية بنجاح'
        });
    } catch (error) {
        console.error('Error in update_id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'حدث خطأ في الخادم' 
        });
    }
});

app.post('/api/delete_id', (req, res) => {
    try {
        const { idNumber, reason } = req.body;
        const idIndex = approvedIds.findIndex(id => id.idNumber === idNumber);
        
        if(idIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'الهوية غير موجودة' 
            });
        }
        
        const deletedId = approvedIds.splice(idIndex, 1)[0];
        
        // في الواقع الفعلي، سيتم إرسال إشعار للمستخدم هنا
        
        res.json({ 
            success: true,
            message: 'تم حذف الهوية بنجاح'
        });
    } catch (error) {
        console.error('Error in delete_id:', error);
        res.status(500).json({ 
            success: false, 
            message: 'حدث خطأ في الخادم' 
        });
    }
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
