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
    <div className="max-w-md mx-auto">
      {/* Osnovni podaci */}
      {step === 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Osnovni podaci</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Datum</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block mb-2">Smena</label>
              <select
                className="w-full p-2 border rounded"
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
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Gotovinski promet</h2>
          <div className="space-y-3">
            {[5000, 2000, 1000, 500, 200, 100, 50, 20, 10].map(value => (
              <div key={value} className="flex items-center space-x-2">
                <span className="w-20">{value} RSD</span>
                <input
                  type="number"
                  className="w-24 p-2 border rounded"
                  value={formData.cash[`rsd${value}` as keyof typeof formData.cash]}
                  onChange={e => handleCashChange(`rsd${value}`, e.target.value)}
                />
                <span className="ml-2">
                  = {(formData.cash[`rsd${value}` as keyof typeof formData.cash] * value).toLocaleString()} RSD
                </span>
              </div>
            ))}
            <div className="flex items-center space-x-2 pt-2 border-t">
              <span className="w-20">EUR</span>
              <input
                type="number"
                className="w-24 p-2 border rounded"
                value={formData.cash.eur}
                onChange={e => handleCashChange('eur', e.target.value)}
              />
              <span className="ml-2">
                = {(formData.cash.eur * 116).toLocaleString()} RSD
              </span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded">
              Ukupno gotovine: {calculateCash().toLocaleString()} RSD
            </div>
          </div>
        </div>
      )}

      {/* Kartice i virmani */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Kartice i virmani</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Ukupan iznos kartica</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={formData.cardTotal}
                onChange={e => setFormData(prev => ({ ...prev, cardTotal: Number(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block mb-2">Ukupan iznos virmana</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={formData.transferTotal}
                onChange={e => setFormData(prev => ({ ...prev, transferTotal: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <div>Ukupno kartice: {formData.cardTotal.toLocaleString()} RSD</div>
              <div>Ukupno virmani: {formData.transferTotal.toLocaleString()} RSD</div>
            </div>
          </div>
        </div>
      )}

      {/* Sastavljač */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Sastavljač izveštaja</h2>
          <div>
            <label className="block mb-2">Ime i prezime</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.preparedBy}
              onChange={e => setFormData(prev => ({ ...prev, preparedBy: e.target.value }))}
              placeholder="Unesite ime i prezime"
            />
          </div>
        </div>
      )}

      {/* Napomene */}
      {step === 4 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Napomene</h2>
          <div className="space-y-4">
            {formData.notes.map((note, index) => (
              <div key={index} className="space-y-2">
                <select
                  className="w-full p-2 border rounded"
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
                    className="w-32 p-2 border rounded"
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
                    className="flex-1 p-2 border rounded"
                    placeholder="Iznos"
                    value={note.amount}
                    onChange={e => {
                      const newNotes = [...formData.notes];
                      newNotes[index] = { ...newNotes[index], amount: Number(e.target.value) || 0 };
                      setFormData(prev => ({ ...prev, notes: newNotes }));
                    }}
                  />
                  <button
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
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
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Pregled i slanje izveštaja</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded space-y-2">
              <div>Datum: {formData.date}</div>
              <div>Smena: {formData.shift}</div>
              <div>Gotovina: {calculateCash().toLocaleString()} RSD</div>
              <div>Kartice: {formData.cardTotal.toLocaleString()} RSD</div>
              <div>Virman: {formData.transferTotal.toLocaleString()} RSD</div>
              <div className="font-bold pt-2 border-t border-gray-200">
                Ukupan promet: {calculateTotal().toLocaleString()} RSD
              </div>
              
              {formData.notes.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="font-semibold mb-2">Napomene:</div>
                  <div className="space-y-1 pl-4">
                    {formData.notes.map((note, index) => (
                      <div key={index} className="text-sm">
                        • {formatNote(note)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                Sastavio: {formData.preparedBy}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                className="flex-1 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => sendReport('whatsapp')}
              >
                Pošalji WhatsApp-om
              </button>
              <button
                className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => sendReport('copy')}
              >
                Kopiraj izveštaj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigacija */}
      <div className="flex justify-between mt-4">
        {step > 0 && (
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setStep(s => s - 1)}
          >
            Nazad
          </button>
        )}
        {step < 5 && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setStep(s => s + 1)}
          >
            Dalje
          </button>
        )}
      </div>
    </div>
  );
}
