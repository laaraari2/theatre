import type { ClassReport } from './reportGenerator';

export function printReport(report: ClassReport): void {
  const techniquesHtml = report.techniquesUsed
    .map(t => `<tr><td style="padding:6px 12px;border:1px solid #ddd">${t.label}</td><td style="padding:6px 12px;border:1px solid #ddd;text-align:center">${t.count}</td></tr>`)
    .join('');

  const sessionsHtml = report.sessions
    .map(s => `<tr><td style="padding:6px 12px;border:1px solid #ddd">${s.date}</td><td style="padding:6px 12px;border:1px solid #ddd">${s.topic}</td><td style="padding:6px 12px;border:1px solid #ddd">${s.techniques.join('، ')}</td></tr>`)
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <title>تقرير ${report.className}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; padding: 40px; color: #2D2D2D; background: #fff; }
    h1 { color: #8B1A1A; border-bottom: 3px solid #D4A843; padding-bottom: 10px; }
    h2 { color: #8B1A1A; margin-top: 30px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
    .stat { background: #FDF6EC; border-radius: 12px; padding: 16px; text-align: center; }
    .stat-value { font-size: 28px; font-weight: 700; color: #8B1A1A; }
    .stat-label { font-size: 14px; color: #6B7280; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #8B1A1A; color: #fff; padding: 10px 12px; }
    .info { background: #FDF6EC; border-radius: 8px; padding: 12px 16px; margin: 8px 0; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>🎭 تقرير ${report.className}</h1>
  <p><strong>المستوى:</strong> ${report.level}</p>

  <div class="stats">
    <div class="stat"><div class="stat-value">${report.totalScheduled}</div><div class="stat-label">مبرمجة</div></div>
    <div class="stat"><div class="stat-value">${report.totalCompleted}</div><div class="stat-label">منجزة</div></div>
    <div class="stat"><div class="stat-value">${report.totalPostponed}</div><div class="stat-label">مؤجلة</div></div>
    <div class="stat"><div class="stat-value">${report.totalCancelled}</div><div class="stat-label">ملغاة</div></div>
  </div>

  <div class="info">📖 <strong>المسرحية:</strong> ${report.scriptTitle}</div>
  ${report.lastSession ? `<div class="info">📅 <strong>آخر حصة:</strong> ${report.lastSession.date} — ${report.lastSession.topic}</div>` : ''}
  ${report.nextSession ? `<div class="info">⏭️ <strong>الحصة القادمة:</strong> ${report.nextSession.date}</div>` : ''}

  ${report.techniquesUsed.length > 0 ? `
  <h2>التقنيات المسرحية الموظفة</h2>
  <table><thead><tr><th>التقنية</th><th>عدد المرات</th></tr></thead><tbody>${techniquesHtml}</tbody></table>
  ` : ''}

  ${report.sessions.length > 0 ? `
  <h2>سجل الحصص المنجزة</h2>
  <table><thead><tr><th>التاريخ</th><th>الموضوع</th><th>التقنيات</th></tr></thead><tbody>${sessionsHtml}</tbody></table>
  ` : ''}

  ${report.teacherNotes.length > 0 ? `
  <h2>ملاحظات الأستاذ</h2>
  ${report.teacherNotes.map(n => `<div class="info">${n}</div>`).join('')}
  ` : ''}
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
