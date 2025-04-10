import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const EULA = () => {
  const eulaText = `
  END USER LICENSE AGREEMENT (EULA)

  This software is licensed, not sold. By installing or using this software, 
  you agree to be bound by the terms of this EULA. If you do not agree to 
  the terms, do not install or use the software.

  1. LICENSE GRANT
  The Company grants you a revocable, non-exclusive, non-transferable, 
  limited license to use the software...

  2. RESTRICTIONS
  You agree not to:
  - Decompile, reverse engineer, or disassemble the software.
  - Modify, rent, lease, or sublicense the software.

  (continued...)
  `;

  return (
    <div className="container mt-4">
      <h5>Medical Acknowledgement Form</h5>
      <div
        className="border p-3"
        style={{
          maxHeight: '200px',
          overflowY: 'scroll',
          backgroundColor: '#f8f9fa',
          whiteSpace: 'pre-wrap',
        }}
      >
        {eulaText}
      </div>
      <div className="form-check mt-3">
      </div>
    </div>
  );
};

export default EULA;
