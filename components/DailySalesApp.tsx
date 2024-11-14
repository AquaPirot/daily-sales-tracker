'use client';

import React, { useState } from 'react';

const styles = {
 container: {
   maxWidth: '800px',
   margin: '0 auto',
   padding: '20px',
   minHeight: '100vh',
   background: 'linear-gradient(135deg, #4169E1 0%, #6A5ACD 100%)',
   fontFamily: 'system-ui, -apple-system, sans-serif'
 },
 appTitle: {
   fontSize: '36px',
   fontWeight: 'bold',
   color: 'white',
   textAlign: 'center' as const,
   marginBottom: '40px',
   textShadow: '0 2px 4px rgba(0,0,0,0.2)'
 },
 denominationText: {
    width: '60px', // smanjujemo širinu
    fontSize: '16px',
    color: '#333'
  },
  numberInput: {
    width: '80px', // smanjujemo širinu inputa
    padding: '8px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    textAlign: 'center' as const,
    backgroundColor: 'white'
  },
  resultText: {
    minWidth: '90px', // fiksna širina za rezultat
    textAlign: 'right' as const,
    fontSize: '16px'
  },
 card: {
   backgroundColor: 'white',
   borderRadius: '16px',
   padding: '24px',
   boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
   marginBottom: '20px'
 },
 title: {
   fontSize: '24px',
   fontWeight: 'bold',
   color: '#333',
   marginBottom: '24px',
   textAlign: 'center' as const
 },
 label: {
   display: 'block',
   marginBottom: '8px',
   color: '#555',
   fontSize: '16px',
   fontWeight: '500'
 },
 input: {
   width: '100%',
   padding: '12px 16px',
   border: '2px solid #e0e0e0',
   borderRadius: '12px',
   fontSize: '16px',
   backgroundColor: '#f8f9fa',
   marginBottom: '15px',
   outline: 'none'
 },
 select: {
   width: '100%',
   padding: '12px 16px',
   border: '2px solid #e0e0e0',
   borderRadius: '12px',
   fontSize: '16px',
   backgroundColor: '#f8f9fa',
   marginBottom: '15px',
   cursor: 'pointer',
   outline: 'none'
 },
 buttonPrimary: {
   backgroundColor: '#4CAF50',
   color: 'white',
   padding: '14px 28px',
   borderRadius: '12px',
   border: 'none',
   cursor: 'pointer',
   fontSize: '16px',
   fontWeight: '600',
   transition: 'all 0.2s'
 },
 buttonSecondary: {
   backgroundColor: '#6c757d',
   color: 'white',
   padding: '14px 28px',
   borderRadius: '12px',
   border: 'none',
   cursor: 'pointer',
   fontSize: '16px',
   fontWeight: '600',
   transition: 'all 0.2s'
 },
 flexRow: {
   display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    width: '100%'
 },
noteCard: {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px'
},
selectInput: {
  width: '100%',
  marginBottom: '8px',
  padding: '8px',
  borderRadius: '8px',
  border: '1px solid #e0e0e0'
},
noteInputsContainer: {
  display: 'flex',
  gap: '8px',
  marginBottom: '8px'
 },
 summaryBox: {
   backgroundColor: '#f8f9fa',
   padding: '20px',
   borderRadius: '12px',
   marginTop: '24px',
   border: '2px solid #e0e0e0'
 },
 summaryRow: {
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
   padding: '8px 0',
   borderBottom: '1px solid #e0e0e0'
 },
 summaryLabel: {
   color: '#666',
   fontSize: '16px'
 },
 summaryValue: {
   color: '#333',
   fontSize: '16px',
   fontWeight: '600'
 },
 summaryTotal: {
   display: 'flex',
   justifyContent: 'space-between',
   alignItems: 'center',
   padding: '16px 0',
   marginTop: '8px',
   borderTop: '2px solid #e0e0e0',
   fontSize: '18px',
   fontWeight: 'bold'
 },
 buttonContainer: {
   display: 'flex',
   justifyContent: 'space-between',
   marginTop: '24px',
   gap: '16px'
 }
};

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
     'complaint': 'Plaćeno iz depozita'
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
     <h1 style={styles.appTitle}>Dnevni promet</h1>

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
    <span style={styles.denominationText}>{value}</span>
    <input
      type="number"
      style={styles.numberInput}
      value={formData.cash[`rsd${value}` as keyof typeof formData.cash]}
      onChange={e => handleCashChange(`rsd${value}`, e.target.value)}
      min="0"
    />
    <span style={styles.resultText}>
      = {(formData.cash[`rsd${value}` as keyof typeof formData.cash] * value).toLocaleString()}
    </span>
  </div>
))}
         <div style={{...styles.flexRow, marginTop: '20px'}}>
           <label style={styles.label}>EUR</label>
           <input
             type="number"
             style={styles.numberInput}
             value={formData.cash.eur}
             onChange={e => handleCashChange('eur', e.target.value)}
             min="0"
           />
           <span style={styles.summaryValue}>
             = {(formData.cash.eur * 116).toLocaleString()} RSD
           </span>
         </div>
         <div style={styles.summaryBox}>
           <div style={styles.summaryTotal}>
             <span>Ukupno gotovine:</span>
             <span>{calculateCash().toLocaleString()} RSD</span>
           </div>
         </div>
       </div>
     )}

     {/* Kartice i virmani */}
     {step === 2 && (
<div style={styles.card}>
  <h2 style={styles.title}>Kartice i virmani</h2>
  <div style={styles.inputGroup}>
    <label style={styles.inputLabel}>Ukupan iznos kartica</label>
    <input
      type="number"
      style={styles.input}
      value={formData.cardTotal}
      onChange={e => setFormData(prev => ({ ...prev, cardTotal: Number(e.target.value) || 0 }))}
    />
  </div>
  <div style={styles.inputGroup}>
    <label style={styles.inputLabel}>Ukupan iznos virmana</label>
    <input
      type="number"
      style={styles.input}
      value={formData.transferTotal}
      onChange={e => setFormData(prev => ({ ...prev, transferTotal: Number(e.target.value) || 0 }))}
    />
  </div>
  <div style={styles.summaryContainer}>
    <div style={styles.summaryRow}>Ukupno kartice: {formData.cardTotal.toLocaleString()} RSD</div>
    <div style={styles.summaryRow}>Ukupno virmani: {formData.transferTotal.toLocaleString()} RSD</div>
  </div>
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
             <div key={index} style={{...styles.card, marginBottom: '16px'}}>
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
                 <option value="complaint">Plaćeno iz depozita</option>
               </select>
               <div style={styles.flexRow}>
                 <input
                   type="text"
                   style={{...styles.numberInput, width: '140px'}}
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
                   style={{...styles.numberInput, flex: 1}}
                   placeholder="Iznos"
                   value={note.amount}
                   onChange={e => {
                     const newNotes = [...formData.notes];
                     newNotes[index] = { ...newNotes[index], amount: Number(e.target.value) || 0 };
                                          setFormData(prev => ({ ...prev, notes: newNotes }));
                   }}
                   min="0"
                 />
                 <button
                   style={{...styles.buttonSecondary, padding: '8px 16px'}}
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
         <div style={styles.summaryBox}>
           <div style={styles.summaryRow}>
             <span>Datum:</span>
             <span>{formData.date}</span>
           </div>
           <div style={styles.summaryRow}>
             <span>Smena:</span>
             <span>{formData.shift}</span>
           </div>
           <div style={styles.summaryRow}>
             <span>Gotovina:</span>
             <span>{calculateCash().toLocaleString()} RSD</span>
           </div>
           <div style={styles.summaryRow}>
             <span>Kartice:</span>
             <span>{formData.cardTotal.toLocaleString()} RSD</span>
           </div>
           <div style={styles.summaryRow}>
             <span>Virman:</span>
             <span>{formData.transferTotal.toLocaleString()} RSD</span>
           </div>
           <div style={styles.summaryTotal}>
             <span>Ukupan promet:</span>
             <span>{calculateTotal().toLocaleString()} RSD</span>
           </div>
         </div>

         {formData.notes.length > 0 && (
           <div style={{marginTop: '24px'}}>
             <h3 style={{...styles.label, fontSize: '18px'}}>Napomene:</h3>
             {formData.notes.map((note, index) => (
               <div key={index} style={{marginLeft: '16px', marginTop: '8px', color: '#666'}}>
                 • {formatNote(note)}
               </div>
             ))}
           </div>
         )}

         <div style={styles.buttonContainer}>
           <button
             style={{...styles.buttonPrimary, flex: 1}}
             onClick={() => sendReport('whatsapp')}
           >
             Pošalji WhatsApp-om
           </button>
           <button
             style={{...styles.buttonSecondary, flex: 1}}
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
