import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';

function AddTransaction({ transactions, setTransactions, newTransaction, setNewTransaction, members }) {
  const [error, setError] = useState('');
  const [customSplits, setCustomSplits] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'payer' && error) {
      setError('');
    }
  };

  const handleParticipantsChange = (e) => {
    const selected = [...e.target.selectedOptions].map((o) => o.value);
    setNewTransaction((prev) => ({
      ...prev,
      participants: selected,
    }));
    setCustomSplits({}); // reset custom splits when participants change
  };

  const handleCustomSplitsChange = (e, participant) => {
    const val = parseFloat(e.target.value);
    setCustomSplits((prev) => ({
      ...prev,
      [participant]: val,
    }));
  };

  const resetForm = () => {
    setNewTransaction({
      payer: '',
      amount: '',
      participants: [],
      splitMode: 'equal',
      customSplits: {},
      description: '',
      date: '',
    });
    setCustomSplits({});
    setError('');
  };

  const handleAddTransaction = () => {
    const { payer, amount, participants, splitMode, description, date } = newTransaction;

    if (!members.includes(payer)) {
      setError(`Invalid payer. Allowed: ${members.join(', ')}`);
      return;
    }

    if (!amount || amount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    if (participants.length === 0) {
      setError('Please select at least one participant.');
      return;
    }

    let finalCustomSplits = {};

    if (splitMode === 'equal') {
      const equalSplit = 100 / participants.length;
      participants.forEach((p) => {
        finalCustomSplits[p] = equalSplit;
      });
    } else {
      const total = Object.values(customSplits).reduce((sum, val) => sum + val, 0);
      if (Math.round(total) !== 100) {
        setError('Custom splits must add up to 100%.');
        return;
      }
      finalCustomSplits = customSplits;
    }

    const newTx = {
      payer,
      amount: parseFloat(amount),
      participants,
      splitMode,
      customSplits: finalCustomSplits,
      description: description || 'No description',
      date: date || new Date().toISOString().split('T')[0],
    };

    setTransactions([...transactions, newTx]);
    resetForm();
  };

  const { payer, amount, splitMode = 'equal', participants = [], description, date } = newTransaction;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Transaction</h2>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Payer</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter payer's name"
              name="payer"
              value={payer}
              onChange={handleInputChange}
              className={error.includes('payer') ? 'is-invalid' : ''}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text>₹</InputGroup.Text>
              <Form.Control
                type="number"
                name="amount"
                value={amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </InputGroup>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={date}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={description}
              onChange={handleInputChange}
              placeholder="E.g. Pizza Party"
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Participants</Form.Label>
          <Form.Control
            as="select"
            multiple
            onChange={handleParticipantsChange}
            value={participants}
          >
            {members.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Split Mode</Form.Label>
          <Form.Check
            type="radio"
            label="Equal"
            name="splitMode"
            value="equal"
            checked={splitMode === 'equal'}
            onChange={handleInputChange}
          />
          <Form.Check
            type="radio"
            label="Custom"
            name="splitMode"
            value="custom"
            checked={splitMode === 'custom'}
            onChange={handleInputChange}
          />
        </Form.Group>

        {splitMode === 'custom' && (
          <Form.Group className="mb-3">
            <Form.Label>Custom Splits (in %)</Form.Label>
            <Row>
              {participants.map((participant) => (
                <Col key={participant} md={3}>
                  <Form.Label>{participant}</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="e.g. 25"
                      onChange={(e) => handleCustomSplitsChange(e, participant)}
                      value={customSplits[participant] || ''}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              ))}
            </Row>
          </Form.Group>
        )}

        {error && <div className="text-danger mb-3">{error}</div>}

        <Button variant="primary" onClick={handleAddTransaction}>
          Add Transaction
        </Button>
      </Form>
    </div>
  );
}

export default AddTransaction;
