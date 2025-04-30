// كود عام لجميع الصفحات
document.addEventListener('DOMContentLoaded', function() {
    // تحديث سنة حقوق النشر
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // إضافة active class للرابط الحالي
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if(link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
