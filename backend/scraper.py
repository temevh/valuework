import requests
from bs4 import BeautifulSoup
from transformers import pipeline, AutoTokenizer
import pandas as pd
import numpy as np
from collections import Counter
import torch
from pymongo.mongo_client import MongoClient
from datetime import datetime, timedelta


device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")


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
    data = []
    print('Starting the loop')
    x = 0
    for url in urls:
        print(f'handling url {url}')
        if x == 10:
            break
        content = get_page_content(url)
        if content:
           
            sentiment = analyze_sentiment(content)
            #print(f'the sentiment {sentiment}')
            
            data.append({"url": url,
                            "sentiment": sentiment["label"],
                            "sentiment_score": sentiment['score']})
        x = x+1
    
    
    positive_count = 0
    negative_count = 0
    
    for item in data:
        if item['sentiment'] == 'POSITIVE':
            positive_count += 1
        elif item['sentiment'] == 'NEGATIVE':
            negative_count += 1

    if positive_count > negative_count:
        return 'positivie'
    elif positive_count < negative_count:
        return 'negative'
    else:
        return 'neutral'



    
# Check the response status and print the result or error


DB_URI="mongodb+srv://temehama:CTroHNLVR4cVSA30@cluster0.kzrxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME="templatedb"

client = MongoClient(DB_URI)
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)



DB = client[DB_NAME]
collections = DB['companies']

companies = collections.find()


for company in companies:
    try:
        # Get simple string sentiment
        sentiment = process_urls(company['name'])  # Returns 'positive' or 'negative'
        
        # Update document with the sentiment string
        collections.update_one(
            {"_id": company['_id']},
            {"$set": {"perception": sentiment}}
        )
        
        print(f"Updated {company['name']}: {sentiment}")
        
    except Exception as e:
        print(f"Error with {company['name']}: {str(e)}")



