from joblib import load
import pandas as pd

# Load the trained model
model = load("titanic_model.joblib")

def get_int(prompt, valid_values=None, max_attempts=3):
    attempts = 0
    while attempts < max_attempts:
        try:
            value = int(input(prompt))
            if valid_values and value not in valid_values:
                raise ValueError
            return value
        except ValueError:
            attempts += 1
            if attempts < max_attempts:
                if valid_values:
                    print(f"Please enter one of {valid_values}. Attempts left: {max_attempts - attempts}")
                else:
                    print(f"Please enter a valid integer. Attempts left: {max_attempts - attempts}")
            else:
                print("Too many invalid attempts. Please try from the start.")
                return None

def get_float(prompt, max_attempts=3):
    attempts = 0
    while attempts < max_attempts:
        try:
            return float(input(prompt))
        except ValueError:
            attempts += 1
            if attempts < max_attempts:
                print(f"Please enter a valid number. Attempts left: {max_attempts - attempts}")
            else:
                print("Too many invalid attempts. Please try from the start.")
                return None

def get_choice(prompt, choices, max_attempts=3):
    attempts = 0
    while attempts < max_attempts:
        value = input(prompt).strip().lower()
        if value in choices:
            return choices[value]  # return numeric encoding
        attempts += 1
        if attempts < max_attempts:
            print(f"Please enter one of {list(choices.keys())}. Attempts left: {max_attempts - attempts}")
        else:
            print("Too many invalid attempts. Please try from the start.")
            return None

# Ask user for passenger details
print("Enter passenger details to predict survival:")

pclass = get_int("Pclass (1, 2, or 3): ", valid_values=[1,2,3])
if pclass is None: exit()

sex_encoded = get_choice("Sex (male/female): ", {"male":1, "female":0})
if sex_encoded is None: exit()

age = get_float("Age: ")
if age is None: exit()

sibsp = get_int("Number of siblings/spouses aboard (SibSp): ")
if sibsp is None: exit()

parch = get_int("Number of parents/children aboard (Parch): ")
if parch is None: exit()

fare = get_float("Fare (typical range 0 - 512, average ~32): ")
if fare is None: exit()

embarked_encoded = get_choice("Port of Embarkation (C, Q, S): ", {"c":0, "q":1, "s":2})
if embarked_encoded is None: exit()

# Prepare DataFrame
test_passenger = pd.DataFrame([{
    "Pclass": pclass,
    "Sex": sex_encoded,
    "Age": age,
    "SibSp": sibsp,
    "Parch": parch,
    "Fare": fare,
    "Embarked": embarked_encoded
}])

# Predict survival
prediction = model.predict(test_passenger)
probabilities = model.predict_proba(test_passenger)

print("\nPrediction:")
print("Survived?" , "Yes" if prediction[0] == 1 else "No")
print(f"Probability of not surviving: {probabilities[0][0]*100:.2f}%")
print(f"Probability of surviving: {probabilities[0][1]*100:.2f}%")
