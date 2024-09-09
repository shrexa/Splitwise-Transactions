import React from 'react';
import { Table } from 'react-bootstrap';

function BalanceSheet({  balances }) {
  return (
    <div className="container mt-4">
            <br></br>
            <br></br>

    <h2 className="mb-4">Balance Sheet</h2>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Person</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(balances).map(([person, balance]) => (
          <tr key={person}>
            <td>{person}</td>
            <td className={balance >= 0 ? 'text-success' : 'text-danger'}>
              ₹{balance.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
      <br></br>

    </Table>
    </div>
  );
}
// export default class balances extends React.BalanceSheet{}

export default BalanceSheet;

// import React from 'react';
// import { Table } from 'react-bootstrap';

// function BalanceSheet({ balances }) {
//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">Balance Sheet</h2>
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>Person</th>
//             <th>Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(balances).map(([person, balance]) => (
//             <tr key={person}>
//               <td>{person}</td>
//               <td className={balance >= 0 ? 'text-success' : 'text-danger'}>
//                 ₹{balance.toFixed(2)}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// }

// export default BalanceSheet;


// import React from 'react';
// import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Icons for credit/debt

// const BalanceSheet = ({ balances }) => {
//   return (
//     <div className="balance-sheet">
//       <h2>Balance Sheet</h2>
//       <ul>
//         {balances.map(({ name, amount }, index) => (
//             <li key={index} style={{ color: amount < 0 ? 'red' : 'green' }}>
//             {name}: ${Math.abs(amount)}
//             {amount < 0 ? <FaArrowDown /> : <FaArrowUp />}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default BalanceSheet;

// errorr

