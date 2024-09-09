import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';

function AddTransaction({ transactions, setTransactions, newTransaction, setNewTransaction }) {
  const [error, setError] = useState('');
  const [customSplits, setCustomSplits] = useState({});

  const allowedPayers = ['Rajneesh', 'Harsit', 'Ankesh', 'Nistha'];

  // Handle input changes to update newTransaction
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error message when user starts typing
    if (error && name === 'payer') {
      setError('');
    }
  };

  const handleParticipantsChange = (e) => {
    const participants = [...e.target.selectedOptions].map((o) => o.value);
    setNewTransaction((prev) => ({
      ...prev,
      participants,
    }));
  };

  const handleCustomSplitsChange = (e, participant) => {
    const value = parseFloat(e.target.value);
    setCustomSplits((prev) => ({
      ...prev,
      [participant]: value,
    }));
  };

  const handleAddTransaction = () => {
    const { payer, amount, participants } = newTransaction;

    // Validate payer
    if (!allowedPayers.includes(payer)) {
      setError(`Invalid payer name. Allowed names are: ${allowedPayers.join(', ')}`);
      return;
    }

    if (splitMode === 'equal') {
      const splitAmount = amount / participants.length;
      const customSplits = participants.reduce((acc, participant) => {
        acc[participant] = splitAmount;
        return acc;
      }, {});
      
      const newTransactionData = {
        ...newTransaction,
        amount: parseFloat(amount),
        splitMode: 'equal',
        customSplits
      };
      setTransactions([...transactions, newTransactionData]);
    } else if (splitMode === 'custom') {
      const totalSplit = Object.values(customSplits).reduce((sum, val) => sum + val, 0);
      if (totalSplit !== 100) {
        alert('The custom splits must add up to 100%');
        return;
      }

      const splitAmounts = participants.reduce((acc, participant) => {
        acc[participant] = (customSplits[participant] / 100) * amount;
        return acc;
      }, {});

      const newTransactionData = {
        ...newTransaction,
        amount: parseFloat(amount),
        splitMode: 'custom',
        customSplits: splitAmounts
      };
      setTransactions([...transactions, newTransactionData]);
    }
  };

  const { payer, amount, splitMode = 'equal', participants = [] } = newTransaction;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Transaction</h2>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formPayer">
            <Form.Label>Payer</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter payer's name"
              name="payer"
              value={payer}
              onChange={handleInputChange}
              className={error ? 'is-invalid' : ''}
            />
            {error && <div className="text-danger">{error}</div>}
          </Form.Group>

          <Form.Group as={Col} controlId="formAmount">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text>₹ </InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Amount"
                name="amount"
                value={amount}
                onChange={handleInputChange}
              />
            </InputGroup>
          </Form.Group>
        </Row>

        <Form.Group controlId="formParticipants" className="mb-3">
          <Form.Label>Participants</Form.Label>
          <Form.Control
            as="select"
            multiple
            onChange={handleParticipantsChange}
            value={participants}
          >
            <option value="Rajneesh">Rajneesh</option>
            <option value="Harsit">Harsit</option>
            <option value="Nistha">Nistha</option>
            <option value="Ankesh">Ankesh</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formSplitMode" className="mb-3">
          <Form.Label>Split Mode</Form.Label>
          <Form.Check
            type="radio"
            label="Equal Split"
            name="splitMode"
            value="equal"
            checked={splitMode === 'equal'}
            onChange={handleInputChange}
          />
          <Form.Check
            type="radio"
            label="Custom Split"
            name="splitMode"
            value="custom"
            checked={splitMode === 'custom'}
            onChange={handleInputChange}
          />
        </Form.Group>

        {splitMode === 'custom' && (
          <Form.Group controlId="formCustomSplits" className="mb-3">
            <Form.Label>Custom Splits</Form.Label>
            <Row>
              {participants.map((participant) => (
                <Col key={participant}>
                  <Form.Label>{participant}</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="Percentage"
                      onChange={(e) => handleCustomSplitsChange(e, participant)}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              ))}
            </Row>
          </Form.Group>
        )}

        <Button variant="primary" onClick={handleAddTransaction}>
          Add Transaction
        </Button>
      </Form>
    </div>
  );
}

export default AddTransaction;
