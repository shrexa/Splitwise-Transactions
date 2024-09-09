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
            <th>Creditor</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.debtor}</td>
              <td>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <span>{transaction.creditor}</span>
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

