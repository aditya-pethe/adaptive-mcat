# call the open ai api to create a small of mcat questions

import openai
from dotenv import load_dotenv
import os
import json

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")



def create_questions(section, subcategory):

    prompt = f"""
    You are an mcat test planner. Please create 5 distinct mcat questions for the {section} section of the mcat,
    in the following subcategory:
    
    {subcategory}. 
    
    Structure your output as only a python list. Do not number the questions. It is very important that it has correct python syntax. For example:

    ["q1", "q2", "q3", "q4", "q5"]
    """

    question_list = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.6,
            max_tokens=200
        ).choices[0].text

    return question_list


def write_data():

    with open("mcat_template.json", "r") as f:    
        template = json.load(f)
        file_content = []
        
        for section in template:
            for subcategory in template[section]['subcategories']:
                raw_question_list = create_questions(section, subcategory)
                raw_question_list = raw_question_list.strip()

                if raw_question_list[0] != "[":
                    raw_question_list = "[" + raw_question_list.split("[")[1]

                question_list = eval(raw_question_list)
                print(question_list)
                print(type(question_list))

                for question in question_list:
                    question_obj = {
                        "section": section,
                        "subcategory": subcategory,
                        "question": question
                    }

                    file_content.append(question_obj)

        with open("question_bank.json", "w") as q:
            json_content = json.dumps(file_content)
            q.write(json_content)

# create_questions("Chemical and Physical Foundations of Biological Systems", "Basic chemical and physical principles of living systems")

write_data()

        
