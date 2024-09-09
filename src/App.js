import React, { useState, useEffect } from 'react';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import BalanceSheet from './components/BalanceSheet';
import DetailedBreakdown from './components/DetailedBreakdown';

function App() {
  // State to manage transactions with dummy data preloaded
  const [transactions, setTransactions] = useState([
    {
      payer: 'Rajneesh',
      amount: 1000,
      participants: ['Rajneesh', 'Harsit', 'Nistha', 'Ankesh'],
      splitMode: 'equal',
      customSplits: {},
    },
    {
      payer: 'Harsit',
      amount: 500,
      participants: ['Harsit', 'Nistha'],
      splitMode: 'custom',
      customSplits: { Harsit: 60, Nistha: 40 },
    },
    {
      payer: 'Nistha',
      amount: 800,
      participants: ['Rajneesh', 'Nistha'],
      splitMode: 'equal',
      customSplits: {},
    },
    {
      payer: 'Ankesh',
      amount: 1200,
      participants: ['Rajneesh', 'Harsit', 'Ankesh'],
      splitMode: 'custom',
      customSplits: { Rajneesh: 30, Harsit: 50, Ankesh: 20 },
    },
  ]);

  // State to manage balance sheet
  const [balances, setBalances] = useState({
    Rajneesh: 0,
    Harsit: 0,
    Nistha: 0,
    Ankesh: 0,
  });

  // State for the new transaction form
  const [newTransaction, setNewTransaction] = useState({
    payer: '',
    amount: 0,
    participants: [],
    splitMode: 'equal', // default to equal split
    customSplits: {}, // for custom split logic
  });

  // Calculate balances whenever transactions change
  useEffect(() => {
    const newBalances = {
      Rajneesh: 0,
      Harsit: 0,
      Nistha: 0,
      Ankesh: 0,
    };

    transactions.forEach((transaction) => {
      const totalAmount = transaction.amount;

      if (transaction.splitMode === 'equal') {
        const equalSplit = totalAmount / transaction.participants.length;
        transaction.participants.forEach((participant) => {
          if (participant !== transaction.payer) {
            newBalances[participant] -= equalSplit;
            newBalances[transaction.payer] += equalSplit;
          }
        });
      } else if (transaction.splitMode === 'custom') {
        Object.entries(transaction.customSplits).forEach(([participant, percentage]) => {
          const splitAmount = (totalAmount * percentage) / 100;
          if (participant !== transaction.payer) {
            newBalances[participant] -= splitAmount;
            newBalances[transaction.payer] += splitAmount;
          }
        });
      }
    });

    setBalances(newBalances);
  }, [transactions]);

  // Calculate balances function for display
  const calculateBalances = () => {
    const newBalances = {
      Rajneesh: 0,
      Harsit: 0,
      Nistha: 0,
      Ankesh: 0,
    };

    transactions.forEach((transaction) => {
      const totalAmount = transaction.amount;
      if (transaction.splitMode === 'equal') {
        const equalSplit = totalAmount / transaction.participants.length;
        transaction.participants.forEach((participant) => {
          if (participant !== transaction.payer) {
            newBalances[participant] -= equalSplit;
            newBalances[transaction.payer] += equalSplit;
          }
        });
      } else if (transaction.splitMode === 'custom') {
        Object.entries(transaction.customSplits).forEach(([participant, percentage]) => {
          const splitAmount = (totalAmount * percentage) / 100;
          if (participant !== transaction.payer) {
            newBalances[participant] -= splitAmount;
            newBalances[transaction.payer] += splitAmount;
          }
        });
      }
    });

    return newBalances;
  };

  return (
    <div className="App">
      <header className="bg-primary text-white text-center py-4">
        <h1>Splitwise Web App</h1>
      </header>
      <main className="container mt-4">
        {/* Passing state and setState to child components */}
        <AddTransaction
          transactions={transactions}
          setTransactions={setTransactions}
          newTransaction={newTransaction}
          setNewTransaction={setNewTransaction}
        />
        <TransactionList transactions={transactions} />
        <BalanceSheet balances={calculateBalances()} />
        <DetailedBreakdown transactions={transactions} />
      </main>
    </div>
  );
}

export default App;
