import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './OrderKeyParsing.css';

function OrderKeyParsing() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const outputRef = useRef(null);

  const mergeStringsAndCopy = async () => {
    var cleanedString = inputText.replace(/[\s;]/g, '');
    var characters = cleanedString.split('');
    var uniqueGroups = [];
    var currentGroup = '';

    for (var i = 0; i < characters.length; i++) {
      currentGroup += characters[i];

      if (currentGroup.length === 7) {
        if (!uniqueGroups.includes(currentGroup)) {
          uniqueGroups.push(currentGroup);
        }
        currentGroup = '';
      }
    }

    var finalString = '000' + uniqueGroups.join(';000');
    setOutputText(finalString);

    try {
      await navigator.clipboard.writeText(finalString);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearFields = () => {
    setInputText('');
    setOutputText('');
  };

  const countSemicolons = () => {
    if (outputText.length > 0) {
      var count = (outputText.match(/;/g) || []).length+1;
      return count;
    }
    return 0;
  };

  return (
    <div className="order-key-parsing d-flex justify-content-center align-items-center vh-100">
      <div className="order-key-parsing-inner p-4">
        <h3>Order-Key Parsing KLS</h3>

        <div className="form-group mb-3">
          <label htmlFor="inputTextbox"></label>
          <input
            type="text"
            id="inputTextbox"
            className="form-control"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter input order"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="outputTextbox"></label>
          <input
            type="text"
            id="outputTextbox"
            className="form-control"
            value={outputText}
            readOnly
            ref={outputRef}
            placeholder="Output will appear here"
          />
        </div>

        <div className="mb-3">
          <button className="btn btn-primary me-2" onClick={mergeStringsAndCopy}>
            Process Copy
          </button>
          <button className="btn btn-secondary" onClick={clearFields}>
            Clear Input
          </button>
        </div>

        <div className="output-info">
          <p className="font-verdana">
            Number of order: <span className="font-weight-bold">{countSemicolons()}</span>
          </p>
        </div>

        <div className="mt-3">
          <Link to="/home" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
        <div className="text-center mt-3">
  <p className="text-muted">
    &copy; {new Date().getFullYear()} Budi Ariyanto - E00904 - PT. Kawan Lama Sejahtera
  </p>
        </div>
      </div>
    </div>
  );
}

export default OrderKeyParsing;
