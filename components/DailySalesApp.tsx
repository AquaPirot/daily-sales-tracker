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
    marginRight: '10px',
    width: '100%'
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

// Sada u komponenti koristimo ove stilove:

export default function DailySalesApp() {
  // ... svi useState i ostale funkcije ostaju iste ...

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
          </div>
          <div style={styles.summaryBox}>
            <div style={styles.summaryText}>Ukupno kartice: {formData.cardTotal.toLocaleString()} RSD</div>
            <div style={styles.summaryText}>Ukupno virmani: {formData.transferTotal.toLocaleString()} RSD</div>
          </div>
        </div>
      )}

      {/* Sastavljač */}
      {step === 3 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Sastavljač izveštaja</h2>
          <label style={styles.label}>Ime i prezime</label>
          <input
            style={styles.input}
            value={formData.preparedBy}
            onChange={e => setFormData(prev => ({ ...prev, preparedBy: e.target.value }))}
            placeholder="Unesite ime i prezime"
          />
        </div>
      )}

      {/* Napomene */}
      {step === 4 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Napomene</h2>
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
      )}

      {/* Pregled i slanje */}
      {step === 5 && (
        <div style={styles.card}>
          <h2 style={styles.title}>Pregled i slanje izveštaja</h2>
          <div style={styles.summaryBox}>
            <div>Datum: {formData.date}</div>
            <div>Smena: {formData.shift}</div>
            <div>Gotovina: {calculateCash().toLocaleString()} RSD</div>
            <div>Kartice: {formData.cardTotal.toLocaleString()} RSD</div>
            <div>Virman: {formData.transferTotal.toLocaleString()} RSD</div>
            <div style={{...styles.summaryText, marginTop: '10px'}}>
              Ukupan promet: {calculateTotal().toLocaleString()} RSD
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
              style={styles.buttonPrimary}
              onClick={() => sendReport('whatsapp')}
            >
              Pošalji WhatsApp-om
            </button>
            <button
              style={{...styles.buttonPrimary, backgroundColor: '#474e59'}}
              onClick={() => sendReport('copy')}
            >
              Kopiraj izveštaj
            </button>
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
            style={styles.buttonPrimary}
            onClick={() => setStep(s => s + 1)}
          >
            Dalje
          </button>
        )}
      </div>
    </div>
  );
}
