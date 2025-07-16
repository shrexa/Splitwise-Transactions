import { useState } from 'react';

function AddTransaction({ transactions, setTransactions, newTransaction, setNewTransaction, members }) {
  const [error, setError] = useState('');
  const [customSplits, setCustomSplits] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'payer' && error) {
      setError('');
    }
  };

  const handleParticipantsChange = (e) => {
    const selected = [...e.target.selectedOptions].map((o) => o.value);
    setNewTransaction((prev) => ({
      ...prev,
      participants: selected,
    }));
    setCustomSplits({}); // reset custom splits when participants change
  };

  const handleCustomSplitsChange = (e, participant) => {
    const val = parseFloat(e.target.value) || 0;
    setCustomSplits((prev) => ({
      ...prev,
      [participant]: val,
    }));
  };

  const resetForm = () => {
    setNewTransaction({
      payer: '',
      amount: '',
      participants: [],
      splitMode: 'equal',
      customSplits: {},
      description: '',
      date: '',
    });
    setCustomSplits({});
    setError('');
    setShowSuccess(false);
  };

  const handleAddTransaction = async () => {
    setIsSubmitting(true);
    const { payer, amount, participants, splitMode, description, date } = newTransaction;

    if (!members.includes(payer)) {
      setError(`Invalid payer. Allowed: ${members.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    if (!amount || amount <= 0) {
      setError('Amount must be a positive number.');
      setIsSubmitting(false);
      return;
    }

    if (participants.length === 0) {
      setError('Please select at least one participant.');
      setIsSubmitting(false);
      return;
    }

    let finalCustomSplits = {};

    if (splitMode === 'equal') {
      const equalSplit = 100 / participants.length;
      participants.forEach((p) => {
        finalCustomSplits[p] = equalSplit;
      });
    } else {
      const total = Object.values(customSplits).reduce((sum, val) => sum + val, 0);
      if (Math.round(total) !== 100) {
        setError('Custom splits must add up to 100%.');
        setIsSubmitting(false);
        return;
      }
      finalCustomSplits = customSplits;
    }

    // Simulate async operation for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const newTx = {
      payer,
      amount: parseFloat(amount),
      participants,
      splitMode,
      customSplits: finalCustomSplits,
      description: description || 'No description',
      date: date || new Date().toISOString().split('T')[0],
    };

    setTransactions([...transactions, newTx]);
    setShowSuccess(true);
    
    // Auto-hide success message and reset form
    setTimeout(() => {
      resetForm();
    }, 1500);
    
    setIsSubmitting(false);
  };

  const { payer, amount, splitMode = 'equal', participants = [], description, date } = newTransaction;

  // Calculate custom splits total for progress bar
  const customSplitsTotal = Object.values(customSplits).reduce((sum, val) => sum + val, 0);
  const isCustomSplitsValid = Math.round(customSplitsTotal) === 100;

  // Calculate individual amounts for preview
  const getIndividualAmount = (participant) => {
    if (!amount || amount <= 0) return 0;
    if (splitMode === 'equal') {
      return (parseFloat(amount) / participants.length).toFixed(2);
    } else {
      const percentage = customSplits[participant] || 0;
      return ((parseFloat(amount) * percentage) / 100).toFixed(2);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            ✨ Add New Transaction
          </h2>
        </div>

        <div style={{ padding: '30px' }}>
          {/* Success Message */}
          {showSuccess && (
            <div style={{
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              color: '#155724',
              animation: 'fadeIn 0.5s ease-in'
            }}>
              <strong>✅ Success!</strong> Transaction added successfully!
            </div>
          )}

          {/* Payer and Amount Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                👤 Payer
              </label>
              <input
                type="text"
                placeholder="Enter payer's name"
                name="payer"
                value={payer}
                onChange={handleInputChange}
                list="members-list"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${error.includes('payer') ? '#dc3545' : payer && members.includes(payer) ? '#28a745' : '#ddd'}`,
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = error.includes('payer') ? '#dc3545' : payer && members.includes(payer) ? '#28a745' : '#ddd'}
              />
              <datalist id="members-list">
                {members.map((member) => (
                  <option key={member} value={member} />
                ))}
              </datalist>
              {payer && members.includes(payer) && (
                <div style={{ color: '#28a745', fontSize: '14px', marginTop: '5px' }}>
                  ✓ Valid payer
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                💰 Amount
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '16px'
                }}>₹</span>
                <input
                  type="number"
                  name="amount"
                  value={amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 35px',
                    borderRadius: '8px',
                    border: `2px solid ${amount && amount > 0 ? '#28a745' : '#ddd'}`,
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = amount && amount > 0 ? '#28a745' : '#ddd'}
                />
              </div>
            </div>
          </div>

          {/* Date and Description Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                📅 Date
              </label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${date ? '#28a745' : '#ddd'}`,
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = date ? '#28a745' : '#ddd'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                📝 Description
              </label>
              <input
                type="text"
                name="description"
                value={description}
                onChange={handleInputChange}
                placeholder="E.g. Pizza Party"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${description ? '#28a745' : '#ddd'}`,
                  fontSize: '16px',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = description ? '#28a745' : '#ddd'}
              />
            </div>
          </div>

          {/* Participants */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              👥 Participants
              {participants.length > 0 && (
                <span style={{
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginLeft: '10px'
                }}>
                  {participants.length} selected
                </span>
              )}
            </label>
            <select
              multiple
              onChange={handleParticipantsChange}
              value={participants}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `2px solid ${participants.length > 0 ? '#28a745' : '#ddd'}`,
                fontSize: '16px',
                minHeight: '120px',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = participants.length > 0 ? '#28a745' : '#ddd'}
            >
              {members.map((name) => (
                <option key={name} value={name} style={{ padding: '8px' }}>
                  {name}
                </option>
              ))}
            </select>
            <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
              💡 Hold Ctrl/Cmd to select multiple participants
            </div>
          </div>

          {/* Split Mode */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#333' }}>
              📊 Split Mode
            </label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="splitMode"
                  value="equal"
                  checked={splitMode === 'equal'}
                  onChange={handleInputChange}
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                Equal Split
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="splitMode"
                  value="custom"
                  checked={splitMode === 'custom'}
                  onChange={handleInputChange}
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                Custom Split
              </label>
            </div>
          </div>

          {/* Custom Splits */}
          {splitMode === 'custom' && participants.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#333' }}>
                📈 Custom Splits
              </label>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span>Total: {customSplitsTotal.toFixed(1)}%</span>
                  <span style={{
                    backgroundColor: isCustomSplitsValid ? '#28a745' : '#ffc107',
                    color: isCustomSplitsValid ? 'white' : '#212529',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {isCustomSplitsValid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(customSplitsTotal, 100)}%`,
                    height: '100%',
                    backgroundColor: customSplitsTotal > 100 ? '#dc3545' : customSplitsTotal === 100 ? '#28a745' : '#17a2b8',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                {participants.map((participant) => (
                  <div key={participant}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                      {participant}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        placeholder="e.g. 25"
                        onChange={(e) => handleCustomSplitsChange(e, participant)}
                        value={customSplits[participant] || ''}
                        min="0"
                        max="100"
                        step="0.1"
                        style={{
                          width: '100%',
                          padding: '8px 25px 8px 8px',
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          fontSize: '14px'
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#666',
                        fontSize: '14px'
                      }}>%</span>
                    </div>
                    {amount && customSplits[participant] && (
                      <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                        ₹{((parseFloat(amount) * customSplits[participant]) / 100).toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Split Preview */}
          {participants.length > 0 && amount && amount > 0 && (
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h6 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>
                👁️ Split Preview
              </h6>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                {participants.map((participant) => (
                  <div key={participant} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef'
                  }}>
                    <span style={{ fontSize: '14px' }}>{participant}:</span>
                    <span style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      ₹{getIndividualAmount(participant)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              color: '#721c24'
            }}>
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={handleAddTransaction}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '15px',
                backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) e.target.style.backgroundColor = '#0056b3';
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) e.target.style.backgroundColor = '#007bff';
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Adding Transaction...
                </>
              ) : (
                <>
                  ➕ Add Transaction
                </>
              )}
            </button>
            <button
              onClick={resetForm}
              disabled={isSubmitting}
              style={{
                padding: '15px 25px',
                backgroundColor: 'transparent',
                color: '#6c757d',
                border: '2px solid #6c757d',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.color = 'white';
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6c757d';
                }
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
        }
        
        select option:checked {
          background-color: #667eea;
          color: white;
        }
        
        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AddTransaction;