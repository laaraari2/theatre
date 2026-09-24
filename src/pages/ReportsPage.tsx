import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { generateClassReport, type ClassReport } from '../services/reportGenerator';
import { printReport } from '../services/pdfExporter';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import StatCard from '../components/ui/StatCard';
import { BarChart3, Printer, CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';

export default function ReportsPage() {
  const classes = useLiveQuery(() => db.classes.orderBy('order').toArray()) ?? [];
  const [selectedClass, setSelectedClass] = useState('');
  const [report, setReport] = useState<ClassReport | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedClass) return;
    setLoading(true);
    const r = await generateClassReport(Number(selectedClass));
    setReport(r);
    setLoading(false);
  };

  return (
    <div>
      <Header title="التقارير" subtitle="استخراج تقارير عن التداريب" />

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Select label="اختر القسم" value={selectedClass} onChange={setSelectedClass}
              options={classes.map(c => ({ value: String(c.id), label: c.name }))} placeholder="— اختر قسماً —" />
          </div>
          <Button onClick={handleGenerate} disabled={!selectedClass || loading} icon={<BarChart3 size={18} />}>
            {loading ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
          </Button>
        </div>
      </Card>

      {report && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">📊 تقرير {report.className}</h2>
            <Button variant="secondary" size="sm" onClick={() => printReport(report)} icon={<Printer size={16} />}>طباعة / PDF</Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard title="مبرمجة" value={report.totalScheduled} icon={<Clock size={20} />} color="text-info" />
            <StatCard title="منجزة" value={report.totalCompleted} icon={<CheckCircle2 size={20} />} color="text-success" />
            <StatCard title="مؤجلة" value={report.totalPostponed} icon={<AlertTriangle size={20} />} color="text-warning" />
            <StatCard title="ملغاة" value={report.totalCancelled} icon={<XCircle size={20} />} color="text-danger" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <h3 className="font-semibold mb-2">📖 المسرحية</h3>
              <p className="text-text-muted">{report.scriptTitle}</p>
            </Card>
            <Card>
              <h3 className="font-semibold mb-2">📅 معلومات</h3>
              {report.lastSession && <p className="text-sm text-text-muted">آخر حصة: {report.lastSession.date} — {report.lastSession.topic}</p>}
              {report.nextSession && <p className="text-sm text-text-muted mt-1">الحصة القادمة: {report.nextSession.date}</p>}
            </Card>
          </div>

          {report.techniquesUsed.length > 0 && (
            <Card className="mb-6">
              <h3 className="font-semibold mb-3">🎭 التقنيات المسرحية الموظفة</h3>
              <div className="space-y-2">
                {report.techniquesUsed.map(t => (
                  <div key={t.label} className="flex items-center gap-3">
                    <span className="text-sm flex-1">{t.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (t.count / Math.max(...report.techniquesUsed.map(x => x.count))) * 100)}%` }} />
                    </div>
                    <span className="text-sm text-text-muted w-8 text-center">{t.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {report.sessions.length > 0 && (
            <Card>
              <h3 className="font-semibold mb-3">📋 الحصص المنجزة</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-start p-2 text-text-muted">التاريخ</th>
                      <th className="text-start p-2 text-text-muted">الموضوع</th>
                      <th className="text-start p-2 text-text-muted">التقنيات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.sessions.map((s, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="p-2 whitespace-nowrap">{s.date}</td>
                        <td className="p-2">{s.topic}</td>
                        <td className="p-2 text-xs text-text-muted">{s.techniques.join('، ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
