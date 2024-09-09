import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    This is what the debt is for!
  </Tooltip>
);

const DetailedBreakdown = ({ transactions }) => {
  return (
    <div className="detailed-breakdown">
            <br></br>
            <br></br>
            <br></br>

      <h3>Who Owes Whom</h3>
      <table>
        <thead>
          <tr>
            <th>Debtor</th>
            <th>Creditors after split</th>
            <th>Amount to be split</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.payer} &nbsp; &nbsp;</td>
              <td>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <span>{transaction.participants.join(', ')} &nbsp; &nbsp;</span>
                </OverlayTrigger>
              </td>
              <td>Rs {transaction.amount}</td>
              {/* <p>{transaction.payer} paid ₹{transaction.amount}</p>
              <p>Involved: {transaction.participants.join(', ')}</p> */}
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <br></br>
      <br></br>

    </div>
  );
};

export default DetailedBreakdown;

