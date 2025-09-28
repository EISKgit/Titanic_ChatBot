from sklearn.ensemble import RandomForestClassifier
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from joblib import dump

data = pd.read_csv("titanic.csv")
X = data[['Pclass','Sex','Age','SibSp','Parch','Fare','Embarked']]
y = data['Survived']

# Encode categorical
le_sex = LabelEncoder()
X['Sex'] = le_sex.fit_transform(X['Sex'])
le_embarked = LabelEncoder()
X['Embarked'] = le_embarked.fit_transform(X['Embarked'].astype(str))

# Impute missing
imputer = SimpleImputer(strategy='mean')
X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)
dump(model, "titanic_model.joblib")
