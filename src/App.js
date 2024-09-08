import React, { useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import BalanceSheet from './components/BalanceSheet';
import DetailedBreakdown from './components/DetailedBreakdown';


function App() {
  
  const [transactions, setTransactions] = useState([]);

   const [newTransaction, setNewTransaction] = useState({
    payer: '',
    amount: 0,
    participants: [],
    splitMode: 'equal', // default to equal split
    customSplits: {}, // for custom split logic
  });

  const balances = {
    Rajneesh: 0,
    Harsit: 0,
    Nistha: 0,
    Ankesh: 0,
  };
  const transaction2 = [
    { debtor: 'Alice', creditor: 'Bob', amount: 50 },
    { debtor: 'Charlie', creditor: 'Alice', amount: 20 },
  ];

  // return (
  //   <div className="App">
  //     {/* Other components */}
  //     <DetailedBreakdown transactions={transactions} />
  //   </div>
  // );

  return (
    <div className="App">
      <header className="bg-primary text-white text-center py-4">
        <h1>Splitwise v Web App</h1>
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
        <BalanceSheet balances={balances} />
        <DetailedBreakdown transaction2={transaction2}/>
      </main>
    </div>
  );

  
}

export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// // import Home from './components/Home';
// import About from './components/About';
// import NotFound from './components/NotFound';
// import AddTransaction from './components/AddTransaction';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import TransactionList from './components/TransactionList';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AddTransaction />} />
//         {/* <Route path="/" element={<TransactionList />} /> */}
//         {/* <Route path="/TransactionList" element={<TransactionList />} /> */}
//         {/* <Route path="*" element={<NotFound />} /> */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// // import Home from './components/Home';
// import About from './components/About';
// import NotFound from './components/NotFound';
// import AddTransaction from './components/AddTransaction';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import TransactionList from './components/TransactionList';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AddTransaction />} />
//         {/* <Route path="/" element={<TransactionList />} /> */}
//         {/* <Route path="/TransactionList" element={<TransactionList />} /> */}
//         {/* <Route path="*" element={<NotFound />} /> */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;
