import React from 'react';
import { Table, Card, Badge } from 'react-bootstrap';

function BalanceSheet({ balances }) {
  // Calculate total positive and negative balances for summary
  const positiveBalances = Object.values(balances).filter(b => b > 0).reduce((sum, b) => sum + b, 0);
  const negativeBalances = Object.values(balances).filter(b => b < 0).reduce((sum, b) => sum + b, 0);

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0">Balance Sheet</h2>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between mb-4">
            <div className="text-center p-3 bg-success bg-opacity-10 rounded">
              <h5 className="text-success">Total to Receive</h5>
              <h3 className="text-success">₹{positiveBalances.toFixed(2)}</h3>
            </div>
            <div className="text-center p-3 bg-danger bg-opacity-10 rounded">
              <h5 className="text-danger">Total to Pay</h5>
              <h3 className="text-danger">₹{Math.abs(negativeBalances).toFixed(2)}</h3>
            </div>
          </div>

          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>Person</th>
                <th className="text-end">Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(balances).map(([person, balance]) => (
                <tr key={person}>
                  <td className="fw-bold">{person}</td>
                  <td className={`text-end ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                    ₹{Math.abs(balance).toFixed(2)}
                  </td>
                  <td>
                    {balance >= 0 ? (
                      <Badge bg="success" className="px-3 py-2">
                        Owes You
                      </Badge>
                    ) : (
                      <Badge bg="danger" className="px-3 py-2">
                        You Owe
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="text-muted">
          Last updated: {new Date().toLocaleString()}
        </Card.Footer>
      </Card>
    </div>
  );
}

export default BalanceSheet;
