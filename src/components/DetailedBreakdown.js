import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Table, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaDownload, FaInfoCircle } from 'react-icons/fa';

const DetailedBreakdown = ({ transactions }) => {
  // Function to handle CSV download
  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Debtor,Creditors,Amount,Split Mode\n";
    
    // Add transaction data
    transactions.forEach(transaction => {
      const row = [
        transaction.payer,
        transaction.participants.join(', '),
        `Rs ${transaction.amount}`,
        transaction.splitMode === 'equal' ? 'Equal' : 'Custom'
      ].join(',');
      csvContent += row + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_details.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTooltip = (participants, payer, amount, splitMode) => (
    <Tooltip id={`tooltip-${payer}`}>
      <div className="text-start">
        <strong>Payer:</strong> {payer}<br />
        <strong>Amount:</strong> Rs {amount}<br />
        <strong>Split Mode:</strong> {splitMode === 'equal' ? 'Equal' : 'Custom'}<br />
        <strong>Participants:</strong> {participants.length}
      </div>
    </Tooltip>
  );

  return (
    <Card className="mt-4 border-0 shadow-sm" style={{ backgroundColor: '#e0f7fa' }}>
      <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#4db6ac', color: 'white' }}>
        <h3 className="mb-0">Transaction Details</h3>
        <Button 
          variant="light" 
          onClick={downloadCSV}
          className="d-flex align-items-center"
          style={{ backgroundColor: '#b2ebf2' }}
        >
          <FaDownload className="me-2" /> Export CSV
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="table-responsive">
          <Table hover className="mb-0" style={{ backgroundColor: 'white' }}>
            <thead style={{ backgroundColor: '#80deea' }}>
              <tr>
                <th>Debtor</th>
                <th>
                  <span className="d-flex align-items-center">
                    Creditors 
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>
                          People who shared in this expense
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle /></span>
                    </OverlayTrigger>
                  </span>
                </th>
                <th>Amount</th>
                <th>Split Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="fw-bold" style={{ color: '#00796b' }}>{transaction.payer}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip(
                        transaction.participants, 
                        transaction.payer, 
                        transaction.amount, 
                        transaction.splitMode
                      )}
                    >
                      <div>
                        {transaction.participants.map((p, i) => (
                          <Badge 
                            key={i} 
                            className="me-1 mb-1"
                            style={{ 
                              backgroundColor: p === transaction.payer ? '#4db6ac' : '#80cbc4',
                              color: 'white'
                            }}
                          >
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </OverlayTrigger>
                  </td>
                  <td className="fw-bold">Rs {transaction.amount.toFixed(2)}</td>
                  <td>
                    <Badge 
                      pill 
                      bg={transaction.splitMode === 'equal' ? 'info' : 'warning'}
                      text={transaction.splitMode === 'equal' ? 'white' : 'dark'}
                    >
                      {transaction.splitMode === 'equal' ? 'Equal' : 'Custom'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        {transactions.length === 0 && (
          <div className="text-center py-4" style={{ color: '#00796b' }}>
            <h5>No transactions recorded yet</h5>
            <p>Add your first transaction to see details here</p>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="text-muted" style={{ backgroundColor: '#b2ebf2' }}>
        Showing {transactions.length} transactions
      </Card.Footer>
    </Card>
  );
};

export default DetailedBreakdown;
