import React, {useState} from "react";
import logo from './logo.svg';
import './App.css';
import mcatData from './mcatData.json';

function App() {
  const [data, setData] = React.useState(null);
  const [showQuestions, setShowQuestions] = useState(false);

  // handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const scores = {};
    for (const [section, subcategoriesObj] of Object.entries(mcatData)) {
      scores[section] = {};
      for (const subcategory of subcategoriesObj.subcategories) {
        const inputValue = event.target[subcategory].value;
        scores[section][subcategory] = parseInt(inputValue, 10);
      }
    }
    console.log(scores)
    setShowQuestions(true); // Show question list when submit button is clicked
    fetchQuestions(scores);
  };

  const fetchQuestions = (requestBody) => {
    // Convert the request object to a query string
    const queryString = new URLSearchParams();
    for (const [section, subcategories] of Object.entries(requestBody)) {
      for (const [subcategory, score] of Object.entries(subcategories)) {
        queryString.append(`${section}.${subcategory}`, score);
      }
    }

    // Make a GET request with the query string
    fetch(`/data?${queryString.toString()}`)
      .then((res) => res.json())
      .then((data) => setData(data.message));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="left-half">
          <form onSubmit={handleSubmit}>
            {Object.entries(mcatData).map(([section, subcategoriesObj]) => (
              <div key={section}>
                <h3 className="form-section">{section}</h3>
                {subcategoriesObj.subcategories.map((subcategory, index) => (
                  <div key={index} className="form-row">
                    <label className="form-label">{subcategory}: </label>
                    <input type="number" min="0" max="5" name={subcategory} className="form-input" />
                    <span className="form-input-indicator">/5</span>
                  </div>
                ))}
              </div>
            ))}
            <button type="submit" className="form-submit-button">Submit</button>
          </form>
        </div>
        <div className="right-half">
          {!data ? (
            <p>Please enter your diagnostic results!</p>
          ) : (
            <div className="question-list">
              {data.map((item, index) => (
                <div key={index} className="question-item">
                  <p>{index + 1}. {item.question}</p> {/* Render the question text with number prefix */}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
export default App;
