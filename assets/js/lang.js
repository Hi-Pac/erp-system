/**
 * HCP-ERP Language Module
 * Supports switching between English and Arabic, with RTL support
 */

// Default language
let currentLanguage = localStorage.getItem('hcp-erp-language') || 'en';

// Translation service
const translationService = {
    // English translations
    en: {
        // Auth
        'login': 'Login',
        'login-subtitle': 'Access your HCP-ERP account',
        'login-button': 'Login',
        'register': 'Register',
        'register-subtitle': 'Create your HCP-ERP account',
        'register-button': 'Register',
        'email': 'Email',
        'password': 'Password',
        'confirm-password': 'Confirm Password',
        'remember-me': 'Remember me',
        'forgot-password': 'Forgot password?',
        'no-account': 'Don\'t have an account?',
        'register-now': 'Register now',
        'have-account': 'Already have an account?',
        'login-here': 'Login here',
        'or-continue-with': 'Or continue with',
        'first-name': 'First Name',
        'last-name': 'Last Name',
        'company': 'Company',
        'agree-terms': 'I agree to the',
        'terms-service': 'Terms of Service',
        'and': 'and',
        'privacy-policy': 'Privacy Policy',
        'english': 'English',
        'arabic': 'العربية',
        'logging-in': 'Logging in',
        'registering': 'Registering',
        
        // Auth errors
        'passwords-dont-match': 'Passwords don\'t match',
        'terms-required': 'You must accept the terms and conditions',
        'error-email-in-use': 'This email is already in use',
        'error-invalid-email': 'Invalid email address',
        'error-operation-not-allowed': 'Operation not allowed',
        'error-weak-password': 'Password is too weak',
        'error-user-disabled': 'This account has been disabled',
        'error-user-not-found': 'No account found with this email',
        'error-wrong-password': 'Incorrect password',
        'error-too-many-attempts': 'Too many failed attempts. Try again later',
        'error-network-issue': 'Network connection error. Check your internet connection',
        'error-unknown': 'An unknown error occurred',
        
        // Dashboard
        'dashboard': 'Dashboard',
        'dashboard-welcome': 'Welcome to HCP-ERP',
        'refresh': 'Refresh',
        'sales': 'Sales',
        'customers': 'Customers',
        'sales-orders': 'Sales Orders',
        'invoices': 'Invoices',
        'inventory': 'Inventory',
        'products': 'Products',
        'suppliers': 'Suppliers',
        'reports': 'Reports',
        'analytics': 'Analytics',
        'settings': 'Settings',
        'users': 'Users',
        'logout': 'Logout',
        'profile': 'Your Profile',
        
        // Stats
        'total-sales': 'Total Sales',
        'from-last-month': 'from last month',
        'total-customers': 'Total Customers',
        'new-orders': 'New Orders',
        'from-last-week': 'from last week',
        'inventory-items': 'Inventory Items',
        'low-stock': 'items low in stock',
        'view-details': 'View details',
        
        // Charts
        'sales-overview': 'Sales Overview',
        'top-products': 'Top Products',
        'this-week': 'This Week',
        'this-month': 'This Month', 
        'this-year': 'This Year',
        
        // Activity
        'recent-activity': 'Recent Activity',
        'new-customer': 'New customer',
        'added-by': 'Added by',
        'new-order': 'New order',
        'ready-to-ship': 'Ready to ship',
        'inventory-alert': 'Inventory alert',
        'low-stock-items': 'Only 5 items left in stock',
        'invoice-overdue': 'Invoice overdue',
        'days-overdue': '5 days overdue',
        'view-all-activity': 'View all activity',
        
        // Tasks
        'tasks': 'Tasks',
        'add-new-task': 'Add New Task',
        'task-title': 'Task Title',
        'due-date': 'Due Date',
        'priority': 'Priority',
        'notes': 'Notes',
        'task-contact': 'Contact new suppliers for raw materials',
        'task-prepare': 'Prepare quarterly financial report',
        'task-update': 'Update inventory tracking system',
        'task-schedule': 'Schedule meeting with key clients',
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'completed': 'Completed',
        'view-all-tasks': 'View all tasks',
        'save': 'Save',
        'cancel': 'Cancel',
        
        // Notifications
        'notifications': 'Notifications',
        'payment-received': 'Payment received',
        'view-all-notifications': 'View all notifications'
    },
    
    // Arabic translations
    ar: {
        // Auth
        'login': 'تسجيل الدخول',
        'login-subtitle': 'الوصول إلى حساب HCP-ERP الخاص بك',
        'login-button': 'تسجيل الدخول',
        'register': 'إنشاء حساب',
        'register-subtitle': 'إنشاء حساب HCP-ERP الخاص بك',
        'register-button': 'إنشاء حساب',
        'email': 'البريد الإلكتروني',
        'password': 'كلمة المرور',
        'confirm-password': 'تأكيد كلمة المرور',
        'remember-me': 'تذكرني',
        'forgot-password': 'نسيت كلمة المرور؟',
        'no-account': 'ليس لديك حساب؟',
        'register-now': 'سجل الآن',
        'have-account': 'لديك حساب بالفعل؟',
        'login-here': 'تسجيل الدخول هنا',
        'or-continue-with': 'أو الاستمرار باستخدام',
        'first-name': 'الاسم الأول',
        'last-name': 'اسم العائلة',
        'company': 'الشركة',
        'agree-terms': 'أوافق على',
        'terms-service': 'شروط الخدمة',
        'and': 'و',
        'privacy-policy': 'سياسة الخصوصية',
        'english': 'English',
        'arabic': 'العربية',
        'logging-in': 'جاري تسجيل الدخول',
        'registering': 'جاري التسجيل',
        
        // Auth errors
        'passwords-dont-match': 'كلمات المرور غير متطابقة',
        'terms-required': 'يجب الموافقة على الشروط والأحكام',
        'error-email-in-use': 'هذا البريد الإلكتروني قيد الاستخدام بالفعل',
        'error-invalid-email': 'عنوان بريد إلكتروني غير صالح',
        'error-operation-not-allowed': 'العملية غير مسموح بها',
        'error-weak-password': 'كلمة المرور ضعيفة جدًا',
        'error-user-disabled': 'تم تعطيل هذا الحساب',
        'error-user-not-found': 'لم يتم العثور على حساب بهذا البريد الإلكتروني',
        'error-wrong-password': 'كلمة مرور غير صحيحة',
        'error-too-many-attempts': 'الكثير من المحاولات الفاشلة. حاول مرة أخرى لاحقًا',
        'error-network-issue': 'خطأ في اتصال الشبكة. تحقق من اتصال الإنترنت الخاص بك',
        'error-unknown': 'حدث خطأ غير معروف',
        
        // Dashboard
        'dashboard': 'لوحة التحكم',
        'dashboard-welcome': 'مرحبًا بك في HCP-ERP',
        'refresh': 'تحديث',
        'sales': 'المبيعات',
        'customers': 'العملاء',
        'sales-orders': 'طلبات المبيعات',
        'invoices': 'الفواتير',
        'inventory': 'المخزون',
        'products': 'المنتجات',
        'suppliers': 'الموردين',
        'reports': 'التقارير',
        'analytics': 'التحليلات',
        'settings': 'الإعدادات',
        'users': 'المستخدمين',
        'logout': 'تسجيل الخروج',
        'profile': 'الملف الشخصي',
        
        // Stats
        'total-sales': 'إجمالي المبيعات',
        'from-last-month': 'من الشهر الماضي',
        'total-customers': 'إجمالي العملاء',
        'new-orders': 'الطلبات الجديدة',
        'from-last-week': 'من الأسبوع الماضي',
        'inventory-items': 'عناصر المخزون',
        'low-stock': 'عناصر منخفضة في المخزون',
        'view-details': 'عرض التفاصيل',
        
        // Charts
        'sales-overview': 'نظرة عامة على المبيعات',
        'top-products': 'أفضل المنتجات',
        'this-week': 'هذا الأسبوع',
        'this-month': 'هذا الشهر', 
        'this-year': 'هذا العام',
        
        // Activity
        'recent-activity': 'النشاط الأخير',
        'new-customer': 'عميل جديد',
        'added-by': 'أضيف بواسطة',
        'new-order': 'طلب جديد',
        'ready-to-ship': 'جاهز للشحن',
        'inventory-alert': 'تنبيه المخزون',
        'low-stock-items': 'لم يتبق سوى 5 عناصر في المخزون',
        'invoice-overdue': 'فاتورة متأخرة',
        'days-overdue': 'متأخرة 5 أيام',
        'view-all-activity': 'عرض كل النشاط',
        
        // Tasks
        'tasks': 'المهام',
        'add-new-task': 'إضافة مهمة جديدة',
        'task-title': 'عنوان المهمة',
        'due-date': 'تاريخ الاستحقاق',
        'priority': 'الأولوية',
        'notes': 'ملاحظات',
        'task-contact': 'الاتصال بموردين جدد للمواد الخام',
        'task-prepare': 'إعداد التقرير المالي الفصلي',
        'task-update': 'تحديث نظام تتبع المخزون',
        'task-schedule': 'جدولة اجتماع مع العملاء الرئيسيين',
        'low': 'منخفضة',
        'medium': 'متوسطة',
        'high': 'عالية',
        'completed': 'مكتملة',
        'view-all-tasks': 'عرض كل المهام',
        'save': 'حفظ',
        'cancel': 'إلغاء',
        
        // Notifications
        'notifications': 'الإشعارات',
        'payment-received': 'تم استلام الدفع',
        'view-all-notifications': 'عرض كل الإشعارات'
    },
    
    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @returns {string} Translated text
     */
    translate: function(key) {
        if (this[currentLanguage] && this[currentLanguage][key]) {
            return this[currentLanguage][key];
        }
        
        // Fallback to English if key not found
        if (this.en[key]) {
            return this.en[key];
        }
        
        // Return key if no translation found
        return key;
    },
    
    /**
     * Update all DOM elements with translation
     */
    updateDOM: function() {
        // Update all elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            element.textContent = this.translate(key);
        });
        
        // Update placeholder attributes for inputs
        document.querySelectorAll('input[placeholder]').forEach(input => {
            const key = input.getAttribute('placeholder');
            if (this[currentLanguage][key]) {
                input.setAttribute('placeholder', this.translate(key));
            }
        });
    }
};

// Initialize language support
document.addEventListener('DOMContentLoaded', function() {
    // Set language based on stored preference
    setLanguage(currentLanguage);
    
    // Add language toggle button handler
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
});

/**
 * Set the application language
 * @param {string} lang - Language code ('en' or 'ar')
 */
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('hcp-erp-language', lang);
    
    // Set RTL for Arabic
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }
    
    // Update all translations
    translationService.updateDOM();
}

/**
 * Toggle between English and Arabic
 */
function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
}
