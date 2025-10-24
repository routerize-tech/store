# دليل نشر موقع التجارة الإلكترونية على خادم Caddy

## المتطلبات الأساسية
- خادم يعمل بنظام Ubuntu 20.04 أو أحدث
- نطاق (domain) يشير إلى عنوان IP الخاص بالخادم
- صلاحيات الوصول إلى root أو sudo
- Node.js 18 أو أحدث
- Caddy web server

## الخطوة 1: إعداد الخادم

### 1.1 تحديث النظام
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 تثبيت Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 1.3 تثبيت Caddy
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main" | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## الخطوة 2: نشر التطبيق

### 2.1 نسخ الملفات إلى الخادم
```bash
# إنشاء مجلد المشروع
sudo mkdir -p /var/www/ecommerce
cd /var/www/ecommerce

# نسخ ملفات المشروع (استخدم Git أو SCP)
# مثال مع Git:
git clone https://github.com/your-username/ecommerce-website.git .
```

### 2.2 تثبيت الاعتماديات وبناء المشروع
```bash
# تثبيت الاعتماديات
npm install

# بناء المشروع للإنتاج
npm run build

# تثبيت اعتماديات الإنتاج فقط
npm ci --production
```

### 2.3 إعداد متغيرات البيئة
```bash
# إنشاء ملف .env.production
sudo nano .env.production
```

أضف المتغيرات التالية:
```
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## الخطوة 3: إعداد Caddy

### 3.1 نسخ ملف Caddyfile
```bash
# نسخ ملف Caddyfile إلى الخادم
sudo cp /path/to/Caddyfile /etc/caddy/Caddyfile

# تعديل النطاق في الملف
sudo nano /etc/caddy/Caddyfile
```

**مهم:** استبدل `your-domain.com` باسم نطاقك الفعلي في ملف Caddyfile.

### 3.2 التحقق من إعدادات Caddy
```bash
sudo caddy validate --config /etc/caddy/Caddyfile
```

### 3.3 إعادة تشغيل Caddy
```bash
sudo systemctl restart caddy
sudo systemctl enable caddy
```

## الخطوة 4: إعداد خدمة systemd (اختياري)

إذا كنت ت prefer استخدام systemd بدلاً من PM2:

### 4.1 نسخ ملف الخدمة
```bash
sudo cp /path/to/ecommerce.service /etc/systemd/system/
```

### 4.2 تفعيل الخدمة
```bash
sudo systemctl daemon-reload
sudo systemctl enable ecommerce
sudo systemctl start ecommerce
```

### 4.3 التحقق من حالة الخدمة
```bash
sudo systemctl status ecommerce
```

## الخطوة 5: إعداد جدار الحماية

```bash
# السماح بمنافذ HTTP و HTTPS
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow ssh
sudo ufw enable
```

## الخطوة 6: التحقق من النشر

### 6.1 التحقق من تشغيل التطبيق
```bash
# التحقق من تشغيل التطبيق على المنفذ 3000
curl http://localhost:3000

# التحقق من نقطة التحقق من الصحة
curl http://localhost:3000/api/health
```

### 6.2 التحقق من Caddy
```bash
# التحقق من حالة Caddy
sudo systemctl status caddy

# عرض سجلات Caddy
sudo journalctl -u caddy -f
```

### 6.3 التحقق من الموقع
افتح المتصفح وانتقل إلى `https://your-domain.com`

## استكشاف الأخطاء وإصلاحها

### مشاكل شائعة:

1. **الموقع لا يعمل**
   ```bash
   # تحقق من تشغيل التطبيق
   sudo systemctl status ecommerce
   # أو
   pm2 status
   
   # تحقق من سجلات Caddy
   sudo journalctl -u caddy -f
   ```

2. **مشاكل في SSL**
   ```bash
   # تحقق من شهادات SSL
   sudo caddy list-certificates
   
   # إجبار تحديث الشهادات
   sudo caddy reload --config /etc/caddy/Caddyfile
   ```

3. **مشاكل في الأذونات**
   ```bash
   # إصلاح أذونات الملفات
   sudo chown -R www-data:www-data /var/www/ecommerce
   sudo chmod -R 755 /var/www/ecommerce
   ```

## الأوامر المفيدة

### إدارة التطبيق
```bash
# إعادة تشغيل التطبيق
sudo systemctl restart ecommerce

# عرض السجلات
sudo journalctl -u ecommerce -f

# تحديث التطبيق
cd /var/www/ecommerce
git pull origin main
npm run build
sudo systemctl restart ecommerce
```

### إدارة Caddy
```bash
# إعادة تحميل الإعدادات
sudo caddy reload

# اختبار الإعدادات
sudo caddy validate --config /etc/caddy/Caddyfile

# عرض السجلات
sudo journalctl -u caddy -f
```

## ملاحظات هامة

1. **النسخ الاحتياطي**: قم بعمل نسخ احتياطي منتظم لقاعدة البيانات والملفات
2. **المراقبة**: استخدم أدوات المراقبة للتأكد من عمل الموقع بشكل جيد
3. **التحديثات**: حافظ على تحديث النظام والحزم بانتظام
4. **الأمان**: استخدم كلمات مرور قوية وفعل المصادقة الثنائية حيثما أمكن

## الدعم

إذا واجهت أي مشاكل، تحقق من:
1. سجلات النظام: `sudo journalctl -f`
2. سجلات Caddy: `sudo journalctl -u caddy -f`
3. سجلات التطبيق: `sudo journalctl -u ecommerce -f`

أتمنى لك نجاحًا في نشر موقعك! 🚀