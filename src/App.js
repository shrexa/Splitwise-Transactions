import React, { useState, useEffect } from 'react';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import BalanceSheet from './components/BalanceSheet';
import DetailedBreakdown from './components/DetailedBreakdown';

function App() {
  // Initial transactions with description and date
  const [transactions, setTransactions] = useState([
    {
      payer: 'Rajneesh',
      amount: 1000,
      participants: ['Rajneesh', 'Harsit', 'Nistha', 'Ankesh'],
      splitMode: 'equal',
      customSplits: {},
      description: 'Dinner at cafe',
      date: '2025-07-14',
    },
    {
      payer: 'Harsit',
      amount: 500,
      participants: ['Harsit', 'Nistha'],
      splitMode: 'custom',
      customSplits: { Harsit: 60, Nistha: 40 },
      description: 'Snacks & Tea',
      date: '2025-07-15',
    },
    {
      payer: 'Nistha',
      amount: 800,
      participants: ['Rajneesh', 'Nistha'],
      splitMode: 'equal',
      customSplits: {},
      description: 'Auto Fare',
      date: '2025-07-15',
    },
    {
      payer: 'Ankesh',
      amount: 1200,
      participants: ['Rajneesh', 'Harsit', 'Ankesh'],
      splitMode: 'custom',
      customSplits: { Rajneesh: 30, Harsit: 50, Ankesh: 20 },
      description: 'Lunch bill',
      date: '2025-07-16',
    },
  ]);

  // Default list of users — can make dynamic later
  const members = ['Rajneesh', 'Harsit', 'Nistha', 'Ankesh'];

  const [balances, setBalances] = useState({});

  const [newTransaction, setNewTransaction] = useState({
    payer: '',
    amount: 0,
    participants: [],
    splitMode: 'equal',
    customSplits: {},
    description: '',
    date: '',
  });

  // Reusable balance calculator
  const calculateBalances = (txns) => {
    const newBalances = {};
    members.forEach((name) => (newBalances[name] = 0));

    txns.forEach((transaction) => {
      const { payer, amount, participants, splitMode, customSplits } = transaction;

      if (splitMode === 'equal') {
        const split = amount / participants.length;
        participants.forEach((person) => {
          if (person !== payer) {
            newBalances[person] -= split;
            newBalances[payer] += split;
          }
        });
      } else if (splitMode === 'custom') {
        Object.entries(customSplits).forEach(([person, percentage]) => {
          const splitAmount = (amount * percentage) / 100;
          if (person !== payer) {
            newBalances[person] -= splitAmount;
            newBalances[payer] += splitAmount;
          }
        });
      }
    });

    return newBalances;
  };

  useEffect(() => {
    setBalances(calculateBalances(transactions));
  }, [transactions]);

  // Handler to reset balances (optional: implement real logic later)
  const handleSettleUp = () => {
    alert('Settle up feature coming soon!');
  };

  return (
    <div className="App">
      <header className="bg-primary text-white text-center py-4">
        <h1>Splitwise Web App</h1>
      </header>

      <main className="container mt-4">
        <AddTransaction
          transactions={transactions}
          setTransactions={setTransactions}
          newTransaction={newTransaction}
          setNewTransaction={setNewTransaction}
          members={members}
        />

        {transactions.length === 0 ? (
          <p className="text-center text-muted">No transactions yet. Add one to get started!</p>
        ) : (
          <>
            <TransactionList transactions={transactions} />
            <BalanceSheet balances={balances} />
            <DetailedBreakdown transactions={transactions} />
          </>
        )}

        <div className="text-center mt-4">
          <button className="btn btn-warning" onClick={handleSettleUp}>
            Settle Up
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
