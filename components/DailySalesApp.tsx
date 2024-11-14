'use client';

import React, { useState } from 'react';

export default function DailySalesApp() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    shift: 'I',
    cash: {
      rsd5000: 0,
      rsd2000: 0,
      rsd1000: 0,
      rsd500: 0,
      rsd200: 0,
      rsd100: 0,
      rsd50: 0,
      rsd20: 0,
      rsd10: 0,
      eur: 0
    },
    cardTotal: 0,
    transferTotal: 0,
    preparedBy: '',
    notes: [] as Array<{
      type: string;
      receiptNumber: string;
      amount: number;
    }>
  });

  // Pomoćne funkcije ostaju iste
  const calculateCash = () => {
    const { cash } = formData;
    return (
      cash.rsd5000 * 5000 +
      cash.rsd2000 * 2000 +
      cash.rsd1000 * 1000 +
      cash.rsd500 * 500 +
      cash.rsd200 * 200 +
      cash.rsd100 * 100 +
      cash.rsd50 * 50 +
      cash.rsd20 * 20 +
      cash.rsd10 * 10 +
      cash.eur * 116
    );
  };

  const calculateTotal = () => {
    return calculateCash() + formData.cardTotal + formData.transferTotal;
  };

  const handleCashChange = (denomination: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      cash: {
        ...prev.cash,
        [denomination]: Number(value) || 0
      }
    }));
  };

  const formatNote = (note: { type: string; receiptNumber: string; amount: number }) => {
    const typeText = {
      'storno': 'Stornirani račun',
      'discount': 'Odobreni popust',
      'complaint': 'Reklamacija'
    }[note.type] || 'Napomena';
    
    return `${typeText} - Račun br. ${note.receiptNumber}, iznos: ${note.amount.toLocaleString()} RSD`;
  };

  const copyReport = async () => {
    const report = generateReport();
    try {
      await navigator.clipboard.writeText(report);
      alert('Izveštaj je kopiran!');
    } catch (err) {
      alert('Greška pri kopiranju. Pokušajte ponovo.');
    }
  };

  const generateReport = () => {
    let report = `*Dnevni izveštaj prometa*\n`;
    report += `Datum: ${formData.date}\n`;
    report += `Smena: ${formData.shift}\n\n`;
    report += `Gotovina: ${calculateCash().toLocaleString()} RSD\n`;
    report += `Kartice: ${formData.cardTotal.toLocaleString()} RSD\n`;
    report += `Virman: ${formData.transferTotal.toLocaleString()} RSD\n`;
    report += `---------------------------------\n`;
    report += `*Ukupan promet: ${calculateTotal().toLocaleString()} RSD*\n\n`;
    
    if (formData.notes.length > 0) {
      report += `Napomene:\n`;
      formData.notes.forEach(note => {
        report += `• ${formatNote(note)}\n`;
      });
    }
    
    report += `\nSastavio: ${formData.preparedBy}`;
    return report;
  };

  const sendReport = (method: 'whatsapp' | 'copy') => {
    const report = generateReport();
    
    if (method === 'whatsapp') {
      const encodedReport = encodeURIComponent(report);
      window.open(`https://wa.me/?text=${encodedReport}`);
    } else if (method === 'copy') {
      copyReport();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Osnovni podaci */}
      {step === 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-primary-700">Osnovni podaci</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-secondary-700">Datum</label>
              <input
                type="date"
                className="input-field"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block mb-2 text-secondary-700">Smena</label>
              <select
                className="input-field"
                value={formData.shift}
                onChange={e => setFormData(prev => ({ ...prev, shift: e.target.value }))}
              >
                <option value="I">I smena</option>
                <option value="II">II smena</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Gotovina */}
      {step === 1 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-primary-700">Gotovinski promet</h2>
          <div className="space-y-4">
            {[5000, 2000, 1000, 500, 200, 100, 50, 20, 10].map(value => (
              <div key={value} className="flex items-center space-x-3">
                <span className="w-24 text-secondary-700">{value} RSD</span>
                <input
                  type="number"
                  className="input-field w-24"
                  value={formData.cash[`rsd${value}` as keyof typeof formData.cash]}
                  onChange={e => handleCashChange(`rsd${value}`, e.target.value)}
                />
                <span className="ml-2 text-secondary-600">
                  = {(formData.cash[`rsd${value}` as keyof typeof formData.cash] * value).toLocaleString()} RSD
                </span>
              </div>
            ))}
            <div className="flex items-center space-x-3 pt-4 border-t border-secondary-200">
              <span className="w-24 text-secondary-700">EUR</span>
              <input
                type="number"
                className="input-field w-24"
                value={formData.cash.eur}
                onChange={e => handleCashChange('eur', e.target.value)}
              />
              <span className="ml-2 text-secondary-600">
                = {(formData.cash.eur * 116).toLocaleString()} RSD
              </span>
            </div>
            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <span className="font-medium text-primary-700">
                Ukupno gotovine: {calculateCash().toLocaleString()} RSD
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Kartice i virmani */}
      {step === 2 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-primary-700">Kartice i virmani</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-secondary-700">Ukupan iznos kartica</label>
              <input
                type="number"
                className="input-field"
                value={formData.cardTotal}
                onChange={e => setFormData(prev => ({ ...prev, cardTotal: Number(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block mb-2 text-secondary-700">Ukupan iznos virmana</label>
              <input
                type="number"
                className="input-field"
                value={formData.transferTotal}
                onChange={e => setFormData(prev => ({ ...prev, transferTotal: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200 space-y-2">
              <div className="text-primary-700">
                Ukupno kartice: {formData.cardTotal.toLocaleString()} RSD
              </div>
              <div className="text-primary-700">
                Ukupno virmani: {formData.transferTotal.toLocaleString()} RSD
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sastavljač */}
      {step === 3 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-primary-700">Sastavljač izveštaja</h2>
          <div>
            <label className="block mb-2 text-secondary-700">Ime i prezime</label>
            <input
              className="input-field"
              value={formData.preparedBy}
              onChange={e => setFormData(prev => ({ ...prev, preparedBy: e.target.value }))}
              placeholder="Unesite ime i prezime"
            />
          </div>
        </div>
      )}

      {/* Napomene */}
      {step === 4 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-primary-700">Napomene</h2>
          <div className="space-y-4">
            {formData.notes.map((note, index) => (
              <div key={index} className="p-4 bg-secondary-50 rounded-lg border border-secondary-200 space-y-3">
                <select
                  className="input-field"
                  value={note.type}
                  onChange={e => {
                    const newNotes = [...formData.notes];
                    newNotes[index] = { ...newNotes[index], type: e.target.value };
                    setFormData(prev => ({ ...prev, notes: newNotes }));
                  }}
                >
                  <option value="">Izaberite tip</option>
                  <option value="storno">Stornirani račun</option>
                  <option value="discount">Odobreni popust</option>
                  <option value="complaint">Reklamacija</option>
                </select>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="input-field w-32"
                    placeholder="Broj računa"
                    value={note.receiptNumber}
                    onChange={e => {
                      const newNotes = [...formData.notes];
                      newNotes[index] = { ...newNotes[index], receiptNumber: e.target.value };
                      setFormData(prev => ({ ...prev, notes: newNotes }));
                    }}
                  />
                  <input
                    type="number"
                    className="input-field flex-1"
                    placeholder="Iznos"
                    value={note.amount}
                    onChange={e => {
                      const newNotes = [...formData.notes];
                      newNotes[index] = { ...newNotes[index], amount: Number(e.target.value) || 0 };
                      setFormData(prev => ({ ...prev, notes: newNotes }));
                    }}
                  />
                  <button
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => {
                      const newNotes = formData.notes.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, notes: newNotes }));
                    }}
                  >
                    Ukloni
                  </button>
                </div>
              </div>
            ))}
            <button
              className="btn-primary w-full"
              onClick={() => setFormData(prev => ({
                ...prev,
                notes: [...prev.notes, { type: '', receiptNumber: '', amount: 0 }]
              }))}
            >
              + Dodaj napomenu
            </button>
          </div>
        </div>
      )}

      {/* Pregled i slanje */}
      {step === 5 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-primary-700">Pregled i slanje izveštaja</h2>
          <div className="space-y-6">
            <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-secondary-600">Datum:</span>
                <span className="font-medium">{formData.date}</span>
                <span className="text-secondary-600">Smena:</span>
                <span className="font-medium">{formData.shift}</span>
              </div>
              <div className="border-t border-secondary-200 my-3"></div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Gotovina:</span>
                  <span className="font-medium">{calculateCash().toLocaleString()} RSD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Kartice:</span>
                  <span className="font-medium">{formData.cardTotal.toLocaleString()} RSD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Virman:</span>
                  <span className="font-medium">{formData.transferTotal.toLocaleString()} RSD</span>
                </div>
              </div>
              <div className="border-t border-secondary-200 my-3"></div>
              <div className="flex justify-between text-lg font-bold text-primary-700">
                <span>Ukupan promet:</span>
                <span>{calculateTotal().toLocaleString()} RSD</span>
              </div>
              
              {formData.notes.length > 0 && (
                <>
                  <div className="border-t border-secondary-200 my-3"></div>
                  <div className="space-y-2">
                    <span className="font-medium text-secondary-700">Napomene:</span>
                    <div className="space-y-1 pl-4">
                      {formData.notes.map((note, index) => (
                        <div key={index} className="text-sm text-secondary-600">
                          • {formatNote(note)}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="border-t border-secondary-200 my-3"></div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Sastavio:</span>
                <span className="font-medium">{formData.preparedBy}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                className="flex-1 btn-primary flex items-center justify-center"
                onClick={() => sendReport('whatsapp')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Pošalji WhatsApp-om
              </button>
              <button
                className="flex-1 btn-secondary flex items-center justify-center"
                onClick={() => sendReport('copy')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Kopiraj izveštaj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigacija */}
      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button
            className="btn-secondary flex items-center"
            onClick={() => setStep(s => s - 1)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Nazad
          </button>
        )}
        {step < 5 && (
          <button
            className="btn-primary flex items-center ml-auto"
            onClick={() => setStep(s => s + 1)}
          >
            Dalje
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
