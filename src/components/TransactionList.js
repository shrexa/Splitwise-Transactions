import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup } from 'react-bootstrap';

function TransactionList({ transactions }) {
  return (
    // <div className="container mt-4">
    //   <h2 className="mb-4">Transaction List</h2>
    //   {transactions.length > 0 ? (
    //     transactions.map((transaction, index) => (
    //       <Card className="mb-3" key={index}>
    //         <Card.Header>
    //           <strong>{transaction.payer}</strong> paid ₹{transaction.amount}
    //         </Card.Header>
    //         <Card.Body>
    //           <Card.Text>Participants: {transaction.participants.join(', ')}</Card.Text>
    //           {transaction.splitMode === 'equal' ? (
    //             <Card.Text>Split equally</Card.Text>
    //           ) : (
    //             <Card.Text>
    //               Custom Splits: {Object.entries(transaction.customSplits).map(
    //                 ([participant, split]) => (
    //                   <span key={participant}>
    //                     {participant}: {split}%{' '}
    //                   </span>
    //                 )
    //               )}
    //             </Card.Text>
    //           )}
    //         </Card.Body>
    //       </Card>
    //     ))
    //   ) : (
    //     <p>No transactions yet!</p>
    //   )}
    // </div>
    <div>
      <br></br>
      <br></br>
      <br></br>
    <h2>View Transactions</h2>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Payer</th>
          <th>Amount</th>
          <th>Participants</th>
          <th>Split Mode</th>
          <th>Custom Splits</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <tr key={index}>
            <td>{transaction.payer}</td>
            <td>${transaction.amount}</td>
            <td>
              {transaction.participants.join(', ')}
            </td>
            <td>{transaction.splitMode}</td>
            <td>
              {transaction.splitMode === 'custom'
                ? Object.entries(transaction.customSplits)
                    .map(([participant, percentage]) => (
                      <div key={participant}>
                        {participant}: {percentage}%
                      </div>
                    ))
                : 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}

export default TransactionList;