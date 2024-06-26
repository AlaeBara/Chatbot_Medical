import random
import json
import torch
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

#take advantage of GPU acceleration when available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('ala.json', 'r') as json_data:
    intents = json.load(json_data)

#used to instantiate the model and make predictions.
#so it can be loaded and used later without having to retrain it every time.
FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

#The .to(device) method moves the model to the device (either the CPU or GPU) 
model = NeuralNet(input_size, hidden_size, output_size).to(device)
#This is useful because it allows us to reuse a pre-trained model without having to train it again from scratch.
model.load_state_dict(model_state)
model.eval()



bot_name = "Sam"

def get_response(msg):
    sentence = tokenize(msg)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    
    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])
    return "I do not understand..."
