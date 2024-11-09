import requests
from bs4 import BeautifulSoup
from transformers import pipeline, AutoTokenizer
import pandas as pd
import numpy as np
from collections import Counter
import torch
from pymongo.mongo_client import MongoClient
import pandas as pd

MAX_LENGTH = 512

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
device_id = 0 if device.type == 'mps' else -1


def split_text(text, max_length=512):
    words = text.split()
    return [" ".join(words[i:i + max_length]) for i in range(0, len(words), max_length)]


def get_urls(search_term):
    api_key = '84643de96a8d40aaaeb872a640e0f849'
    endpoint = f'https://newsapi.org/v2/everything?q={search_term}&apiKey={api_key}'
    
    response = requests.get(endpoint)
    results = response.json()
    
    # Extract URLs from articles
    if "articles" in results:
        return [item['url'] for item in results['articles']]
    else:
        print("Error: 'articles' key not found in the response.")
        return []


def get_page_content(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # Extract all paragraphs
        paragraphs = [p.text for p in soup.find_all('p')]
        return " ".join(paragraphs)
    return None

def LLM_text_processing(content):
    nli_name = "facebook/bart-large-mnli"
    nli_model = pipeline("zero-shot-classification", model=nli_name,fromflax = True, device=device_id)
    nli_tokenizer = AutoTokenizer.from_pretrained(nli_name)

    sentiment_name = "distilbert-base-uncased-finetuned-sst-2-english"
    sentiment_analyzer = pipeline("sentiment-analysis", model=sentiment_name, device=0 if device.type == "mps" else -1)    
    sentiment_tokenizer = AutoTokenizer.from_pretrained(sentiment_name)
    

    sentences = [s.strip() for s in content.split('.') if s.strip()]


    candidate_labels = ['work life balance','company communication','opportunities for actual professionals','flexible work hours',
              'responsible management','organized team building activites','company benefits','recognition for workers',
              ]

    categorized_labels = []
    
    for sentence in sentences:
        # Get NLI classifications
        nli_tokens = nli_tokenizer(sentence, truncation=True, padding='max_length', max_length=512, return_tensors="pt")
        sent_tokens = sentiment_tokenizer(sentence, truncation=True, padding='max_length', max_length=512, return_tensors="pt")
        if nli_tokens['input_ids'].shape[1] > MAX_LENGTH or sent_tokens['input_ids'].shape[1]> MAX_LENGTH:
            continue
        nli_output = nli_model(sentence, candidate_labels,truncation=True, max_length=512)
        
        # Get sentiment - now correctly accessing the first item
        sentiment_result = sentiment_analyzer(sentence,truncation=True, max_length=512)[0]  # Get first item from list
        
        # Filter high-confidence predictions (>0.75)
        for label, score in zip(nli_output['labels'], nli_output['scores']):
            if score > 0.75:
                categorized_labels.append({
                    'sentence': sentence,
                    'label': label,
                    'label_confidence': score,
                    'sentiment': sentiment_result['label'],
                    'sentiment_confidence': sentiment_result['score']
                })


    
    
    dataframe = pd.DataFrame(categorized_labels)
    return dataframe


def analyze_sentiment(content):
    model_name = "distilbert-base-uncased-finetuned-sst-2-english"
    sentiment_analyzer = pipeline("sentiment-analysis", model=model_name, device=0 if device.type == "mps" else -1)
    
    # Get the tokenizer for the model
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    # Split content into sentences or smaller chunks
    sentences = [s.strip() for s in content.split('.') if s.strip()]
    sentiments = []
    
    for sentence in sentences:
        try:
            # Tokenize and truncate to model's maximum length
            tokens = tokenizer(sentence, truncation=True, max_length=512, return_tensors="pt")
            
            # Get sentiment for the truncated text
            result = sentiment_analyzer(sentence, truncation=True, max_length=512)[0]
            sentiments.append(result)
        except Exception as e:
            print(f"Error analyzing sentiment for sentence: {str(e)}")
            continue
    
    if not sentiments:
        return {"label": "UNKNOWN", "score": 0.0}
    
    # Calculate aggregate sentiment
    labels = [s['label'] for s in sentiments]
    scores = [s['score'] for s in sentiments]
    
    # Get the most common sentiment label
    most_common_label = Counter(labels).most_common(1)[0][0]
    
    # Calculate weighted average score
    avg_score = np.mean(scores)
    
    return {"label": most_common_label, "score": avg_score}


def process_urls(search_term):
    urls = get_urls(search_term)
    AllDataDF = pd.DataFrame()
    print('Starting the loop')
    x = 0
    for url in urls:
        print(f'handling url {url}')
        if x == 10:
            break
        content = get_page_content(url)
        if content:
            print("Content retrieved successfully")
            
            # Get DataFrame from LLM processing
            dataframe = LLM_text_processing(content)
            
            # Debug prints
            print(f"\nDataframe from this URL:")
            print(f"Shape: {dataframe.shape if isinstance(dataframe, pd.DataFrame) else 'Not a DataFrame'}")
            print(f"Columns: {dataframe.columns.tolist() if isinstance(dataframe, pd.DataFrame) else 'Not a DataFrame'}")
            print(f"Number of rows: {len(dataframe) if isinstance(dataframe, pd.DataFrame) else 'Not a DataFrame'}")
            
            if isinstance(dataframe, pd.DataFrame) and not dataframe.empty:
                # Add URL information
                dataframe['url'] = url
                
                # Concatenate with main DataFrame
                AllDataDF = pd.concat([AllDataDF, dataframe], ignore_index=True)
                
                print(f"\nCombined DataFrame after concatenation:")
                print(f"Shape: {AllDataDF.shape}")
                print(f"Number of rows: {len(AllDataDF)}")
            else:
                print("No data found in this URL's content")
                
            x = x + 1
    
   
    
    
    if not AllDataDF.empty:
        # Calculate overall statistics per label
        overall_stats = AllDataDF.groupby('label').agg({
            'label_confidence': ['mean'],
            'sentiment_confidence': 'mean',
            'sentiment': lambda x: (x == 'POSITIVE').mean()
        }).round(3).reset_index()

      

        return overall_stats

    

    
# Check the response status and print the result or error
search_word = 'Umbrella corp'


DB_URI="mongodb+srv://temehama:CTroHNLVR4cVSA30@cluster0.kzrxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME="valuework"

client = MongoClient(DB_URI)
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)



DB = client[DB_NAME]
collections = DB['LLM-data']

grrr = collections



    
try:
        # Get simple string sentiment
        stats = process_urls(search_word)  # Returns 'positive' or 'negative'
        
        # Update document with the sentiment string
        print("rikki tässä")
        stats.reset_index(inplace=True)  # Flatten index to make it a normal column
        stats.columns = [' '.join(col).strip() for col in stats.columns]
        print("Columns in stats DataFrame:", stats.columns)
      
        company_doc = {
                    "name": search_word,
                    "label": stats['label'].tolist(),
                    "label confidence" : stats['label_confidence mean'].tolist(),
                    "sentiment confidence" : stats['sentiment_confidence mean'].tolist(),
                    "sentiment" : stats['sentiment <lambda>'].tolist()
                    
                }
        print("rikki just ennen inserttiä ")
        result = grrr.insert_one(company_doc)
except Exception as e:
        print(f"Error processing  {str(e)}")  





