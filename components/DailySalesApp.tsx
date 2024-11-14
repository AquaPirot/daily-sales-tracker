'use client';

import React, { useState } from 'react';

// Definišemo stilove kao JavaScript objekte
const styles = {
  container: {
    maxWidth: '500px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f0f7ff'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e1e7ef',
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1a6cf5'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#474e59'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d4d8dd',
    borderRadius: '6px',
    marginBottom: '15px'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d4d8dd',
    borderRadius: '6px',
    marginBottom: '15px',
    backgroundColor: 'white'
  },
  buttonPrimary: {
    backgroundColor: '#1a6cf5',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px'
  },
  buttonSecondary: {
    backgroundColor: '#474e59',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer'
  },
  summaryBox: {
    backgroundColor: '#e6f0ff',
    padding: '15px',
    borderRadius: '6px',
    marginTop: '15px',
    border: '1px solid #cce0ff'
  },
  summaryText: {
    color: '#1a6cf5',
    fontWeight: 'bold'
  },
  flexRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  numberInput: {
    width: '100px',
    padding: '8px 12px',
    border: '1px solid #d4d8dd',
    borderRadius: '6px',
    marginRight: '10px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  }
};

export default function DailySalesApp() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    date: '',
    shift: 'I',
    cash: {
      5000: 0,
      2000: 0,
      1000: 0,
      500: 0,
      200: 0,
      100: 0,
      50: 0,
      20: 0,
      10: 0,
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
    <div style={styles.container}>
      {/* Osnovni podaci */}
      {step === 0 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Osnovni podaci</h2>
          <div>
            <label style={styles.label}>Datum</label>
            <input
              type="date"
              style={styles.input}
              value={formData.date}
              onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
            <label style={styles.label}>Smena</label>
            <select
              style={styles.select}
              value={formData.shift}
              onChange={e => setFormData(prev => ({ ...prev, shift: e.target.value }))}
            >
              <option value="I">I smena</option>
              <option value="II">II smena</option>
            </select>
          </div>
        </div>
      )}

      {/* Gotovina */}
      {step === 1 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Gotovinski promet</h2>
          <div>
            {[5000, 2000, 1000, 500, 200, 100, 50, 20, 10].map(value => (
              <div key={value} style={styles.flexRow}>
                <span style={styles.label}>{value} RSD</span>
                <input
                  type="number"
                  style={styles.numberInput}
                  value={formData.cash[`rsd${value}` as keyof typeof formData.cash]}
                  onChange={e => handleCashChange(`rsd${value}`, e.target.value)}
                />
                <span>
                  = {(formData.cash[`rsd${value}` as keyof typeof formData.cash] * value).toLocaleString()} RSD
                </span>
              </div>
            ))}
            <div style={styles.flexRow}>
              <span style={styles.label}>EUR</span>
              <input
                type="number"
                style={styles.numberInput}
                value={formData.cash.eur}
                onChange={e => handleCashChange('eur', e.target.value)}
              />
              <span>= {(formData.cash.eur * 116).toLocaleString()} RSD</span>
            </div>
            <div style={styles.summaryBox}>
              <span style={styles.summaryText}>
                Ukupno gotovine: {calculateCash().toLocaleString()} RSD
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Kartice i virmani */}
      {step === 2 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Kartice i virmani</h2>
          <div>
            <label style={styles.label}>Ukupan iznos kartica</label>
            <input
              type="number"
              style={styles.input}
              value={formData.cardTotal}
              onChange={e => setFormData(prev => ({ ...prev, cardTotal: Number(e.target.value) || 0 }))}
            />
            <label style={styles.label}>Ukupan iznos virmana</label>
            <input
              type="number"
              style={styles.input}
              value={formData.transferTotal}
              onChange={e => setFormData(prev => ({ ...prev, transferTotal: Number(e.target.value) || 0 }))}
            />
            <div style={styles.summaryBox}>
              <div style={styles.summaryText}>Ukupno kartice: {formData.cardTotal.toLocaleString()} RSD</div>
              <div style={styles.summaryText}>Ukupno virmani: {formData.transferTotal.toLocaleString()} RSD</div>
            </div>
          </div>
        </div>
      )}

      {/* Sastavljač */}
      {step === 3 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Sastavljač izveštaja</h2>
          <div>
            <label style={styles.label}>Ime i prezime</label>
            <input
              style={styles.input}
              value={formData.preparedBy}
              onChange={e => setFormData(prev => ({ ...prev, preparedBy: e.target.value }))}
              placeholder="Unesite ime i prezime"
            />
          </div>
        </div>
      )}

      {/* Napomene */}
      {step === 4 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Napomene</h2>
          <div>
            {formData.notes.map((note, index) => (
              <div key={index} style={{...styles.card, marginBottom: '10px'}}>
                <select
                  style={styles.select}
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
                <div style={styles.flexRow}>
                  <input
                    type="text"
                    style={styles.numberInput}
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
                    style={styles.numberInput}
                    placeholder="Iznos"
                    value={note.amount}
                    onChange={e => {
                      const newNotes = [...formData.notes];
                      newNotes[index] = { ...newNotes[index], amount: Number(e.target.value) || 0 };
                      setFormData(prev => ({ ...prev, notes: newNotes }));
                    }}
                  />
                  <button
                    style={{...styles.buttonSecondary, backgroundColor: '#dc3545'}}
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
              style={styles.buttonPrimary}
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
        <div style={styles.card}>
          <h2 style={styles.title}>Pregled i slanje izveštaja</h2>
          <div>
            <div style={styles.summaryBox}>
              <div style={styles.flexRow}>
                <span style={styles.label}>Datum:</span>
                <span>{formData.date}</span>
              </div>
              <div style={styles.flexRow}>
                <span style={styles.label}>Smena:</span>
                <span>{formData.shift}</span>
              </div>
              <div style={styles.flexRow}>
                <span style={styles.label}>Gotovina:</span>
                <span>{calculateCash().toLocaleString()} RSD</span>
              </div>
              <div style={styles.flexRow}>
                <span style={styles.label}>Kartice:</span>
                <span>{formData.cardTotal.toLocaleString()} RSD</span>
              </div>
              <div style={styles.flexRow}>
                <span style={styles.label}>Virman:</span>
                <span>{formData.transferTotal.toLocaleString()} RSD</span>
              </div>
              <div style={{...styles.flexRow, ...styles.summaryText}}>
                <span>Ukupan promet:</span>
                <span>{calculateTotal().toLocaleString()} RSD</span>
              </div>
            </div>

            {formData.notes.length > 0 && (
              <div style={{marginTop: '20px'}}>
                <h3 style={{...styles.label, fontWeight: 'bold'}}>Napomene:</h3>
                {formData.notes.map((note, index) => (
                  <div key={index} style={{marginLeft: '20px', marginTop: '5px'}}>
                    • {formatNote(note)}
                  </div>
                ))}
              </div>
            )}

            <div style={{...styles.buttonContainer, marginTop: '20px'}}>
              <button
                style={{...styles.buttonPrimary, flex: 1, marginRight: '10px'}}
                onClick={() => sendReport('whatsapp')}
              >
                Pošalji WhatsApp-om
              </button>
              <button
                style={{...styles.buttonPrimary, flex: 1, backgroundColor: '#474e59'}}
                onClick={() => sendReport('copy')}
              >
                Kopiraj izveštaj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigacija */}
      <div style={styles.buttonContainer}>
        {step > 0 && (
          <button
            style={styles.buttonSecondary}
            onClick={() => setStep(s => s - 1)}
          >
            Nazad
          </button>
        )}
        {step < 5 && (
          <button
            style={{...styles.buttonPrimary, marginLeft: 'auto'}}
            onClick={() => setStep(s => s + 1)}
          >
            Dalje
          </button>
        )}
      </div>
    </div>
  );
}
