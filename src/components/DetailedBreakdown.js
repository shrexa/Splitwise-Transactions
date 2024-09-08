import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    This is what the debt is for!
  </Tooltip>
);

const DetailedBreakdown = ({ transaction2 }) => {
  return (
    <div className="detailed-breakdown">
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
          {transaction2.map((transaction, index) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailedBreakdown;

