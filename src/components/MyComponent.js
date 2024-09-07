import React from 'react';
import { Button, Navbar } from 'react-bootstrap';

function MyComponent() {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
      </Navbar>
      <Button variant="primary">Click Me</Button>
    </div>
  );
}

export default MyComponent;
