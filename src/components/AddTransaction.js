import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';


function AddTransaction({  transactions, setTransactions, newTransaction, setNewTransaction }) {
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [participants, setParticipants] = useState([]);
  const [splitMode, setSplitMode] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});

  
  const handleAddTransaction = () => {
    if (splitMode === 'equal') {
      const splitAmount = amount / participants.length;
      const customSplits = participants.reduce((acc, participant) => {
        acc[participant] = splitAmount;
        return acc;
      }, {});
      
      const newTransaction = {
        payer,
        amount: parseFloat(amount),
        participants,
        splitMode: 'equal',
        customSplits
      };
      setTransactions([...transactions, newTransaction]);
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
  
      const newTransaction = {
        payer,
        amount: parseFloat(amount),
        participants,
        splitMode: 'custom',
        customSplits: splitAmounts
      };
      setTransactions([...transactions, newTransaction]);
    }
  };
  

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
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formAmount">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text>₹</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Row>

        <Form.Group controlId="formParticipants" className="mb-3">
          <Form.Label>Participants</Form.Label>
          <Form.Control
            as="select"
            multiple
            onChange={(e) =>
              setParticipants([...e.target.selectedOptions].map((o) => o.value))
            }
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
            onChange={(e) => setSplitMode(e.target.value)}
          />
          <Form.Check
            type="radio"
            label="Custom Split"
            name="splitMode"
            value="custom"
            checked={splitMode === 'custom'}
            onChange={(e) => setSplitMode(e.target.value)}
          />
        </Form.Group>

        {splitMode === 'custom' && (
          <Form.Group controlId="formCustomSplits" className="mb-3">
            <Form.Label>Custom Splits</Form.Label>
            {/* Input for each participant's custom split percentage */}
            <Row>
              {['Rajneesh', 'Harsit', 'Nistha', 'Ankesh'].map((participant) => (
                <Col key={participant}>
                  <Form.Label>{participant}</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="Percentage"
                      onChange={(e) =>
                        setCustomSplits({
                          ...customSplits,
                          [participant]: parseFloat(e.target.value),
                        })
                      }
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
