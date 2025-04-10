import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';

function DatePicker() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Container className="mt-5">
      <Form.Group controlId="formDateTime">
        <Form.Label>Select Date and Time</Form.Label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd h:mm aa"
          className="form-control"
        />
      </Form.Group>
    </Container>
  );
}

export default DatePicker;
