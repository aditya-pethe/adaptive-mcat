import data from '../data/question_bank.json' assert { type: 'json' };
import express from 'express';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 8080;

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

const getFilteredQuestions = (questions, scores) => {
    const filteredQuestions = [];
    const questionCounter = {};
  
    // Initialize the question counter for each subcategory with the desired scores
    for (const section of Object.values(scores)) {
      for (const [subcategory, score] of Object.entries(section)) {
        questionCounter[subcategory] = { desired: 5 - score, count: 0 };
      }
    }
  
    // Iterate through the questions and add them to the filtered list based on the desired scores
    for (const question of questions) {
      const { section, subcategory, question: questionText } = question;
  
      // Check if the subcategory exists in the scores request object
      if (scores[section] && scores[section][subcategory]) {
        // Check if the desired number of questions for the subcategory has been reached
        if (questionCounter[subcategory].count < questionCounter[subcategory].desired) {
          filteredQuestions.push(question);
          questionCounter[subcategory].count++; // Increment the count for the subcategory
        }
      }
    }
  
    return filteredQuestions;
  };


app.get("/data", (req, res) => {
    
    console.log(req.query)
    const scores = {};
    for (const [key, score] of Object.entries(req.query)) {
        const [section, subcategory] = key.split('.'); // Split the key into section and subcategory
        if (!scores[section]) {
        scores[section] = {}; // Initialize the section object if it doesn't exist
        }
        scores[section][subcategory] = parseInt(score, 10); // Assign the score to the corresponding subcategory
    }

    var newQuestions = getFilteredQuestions(data, scores);
    // console.log(newQuestions);
    
    res.json({ message: newQuestions });
  });


// const testscores = {
//     "Chemical and Physical Foundations of Biological Systems": {
//       "Basic chemical and physical principles of living systems": 3,
//       "Periodic table, chemical reactions, and stoichiometry": 4
//     },
//     "Biological and Biochemical Foundations of Living Systems": {
//       "Structure and function of biomolecules (proteins, nucleic acids, carbohydrates, lipids)": 5
//     }
//   };
// console.log(getFilteredQuestions(data, testscores));
