import React, { useState } from 'react';

const TransactionList = ({ transactions }) => {
  console.log('Transactions in TransactionList:', transactions);
  
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique payers for filter dropdown
  const uniquePayers = [...new Set(transactions.map(t => t.payer))];

  // Filter and sort transactions
  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterBy === 'all' || transaction.payer === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        case 'payer':
          return a.payer.localeCompare(b.payer);
        default:
          return 0;
      }
    });

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalTransactions = transactions.length;

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getIndividualAmount = (transaction, participant) => {
    if (transaction.splitMode === 'equal') {
      return (transaction.amount / transaction.participants.length).toFixed(2);
    } else {
      const percentage = transaction.customSplits[participant] || 0;
      return ((transaction.amount * percentage) / 100).toFixed(2);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '30px',
        color: 'white',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>
          📊 Transaction History
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalTransactions}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Transactions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{totalAmount.toFixed(2)}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Amount</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{uniquePayers.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Active Payers</div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              🔍 Search
            </label>
            <input
              type="text"
              placeholder="Search by payer, description, or participant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontSize: '14px',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              📋 Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontSize: '14px',
                backgroundColor: 'white',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
              <option value="payer">Payer Name</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              🎯 Filter By Payer
            </label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontSize: '14px',
                backgroundColor: 'white',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            >
              <option value="all">All Payers</option>
              {uniquePayers.map(payer => (
                <option key={payer} value={payer}>{payer}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
        Showing {filteredAndSortedTransactions.length} of {totalTransactions} transactions
      </div>

      {/* Transactions Display */}
      {filteredAndSortedTransactions.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredAndSortedTransactions.map((transaction, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e9ecef',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}>
              {/* Transaction Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                    💰 {transaction.payer} paid ₹{transaction.amount.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    📅 {formatDate(transaction.date)} • 📝 {transaction.description}
                  </div>
                </div>
                <div style={{
                  backgroundColor: transaction.splitMode === 'equal' ? '#17a2b8' : '#ffc107',
                  color: transaction.splitMode === 'equal' ? 'white' : '#212529',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {transaction.splitMode === 'equal' ? '⚖️ Equal Split' : '🎯 Custom Split'}
                </div>
              </div>

              {/* Participants Section */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                  👥 Participants ({transaction.participants.length})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {transaction.participants.map((participant) => (
                    <div key={participant} style={{
                      backgroundColor: '#f8f9fa',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{participant}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#007bff' }}>
                          ₹{getIndividualAmount(transaction, participant)}
                        </div>
                        {transaction.splitMode === 'custom' && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {transaction.customSplits[participant]}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Splits Details */}
              {transaction.splitMode === 'custom' && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '8px',
                  padding: '15px',
                  marginTop: '15px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#856404', marginBottom: '10px' }}>
                    📊 Custom Split Breakdown
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    {Object.entries(transaction.customSplits).map(([participant, percentage]) => (
                      <div key={participant} style={{
                        backgroundColor: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #f0c14b',
                        fontSize: '13px'
                      }}>
                        <strong>{participant}:</strong> {percentage}% = ₹{((transaction.amount * percentage) / 100).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '60px 20px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📋</div>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>
            {transactions.length === 0 ? 'No transactions yet!' : 'No transactions match your search'}
          </h3>
          <p style={{ color: '#999', fontSize: '16px' }}>
            {transactions.length === 0 
              ? 'Add your first transaction to get started!'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
        
        input:focus, select:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </div>
  );
};

export default TransactionList;