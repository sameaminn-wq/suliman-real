{ pkgs, ... }: {
  # تحديد الإصدار المستقر للنظام
  channel = "stable-24.05";

  # تثبيت الحزم البرمجية اللازمة
  packages = [
    pkgs.nodejs_20
    pkgs.openssl       # ضروري جداً لعمل Prisma و SQLite
    pkgs.nodePackages.prisma # لتسهيل تشغيل أوامر بريزما
  ];

  # إضافات ذكية للمحرر (تسهل عليك البرمجة)
  idx.extensions = [
    "prisma.prisma"                       # تلوين كود قاعدة البيانات
    "bradlc.vscode-tailwindcss"           # مساعد Tailwind CSS
    "christian-kohler.path-intellisense"  # إكمال تلقائي لمسارات الملفات
  ];

  # إعدادات المعاينة (Preview)
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}