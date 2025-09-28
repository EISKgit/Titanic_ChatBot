from api.langgraph_bot import graph, ctx

current_node = graph.start_node
while current_node.name != "End":
    message = current_node.run(ctx)
    print("Bot:", message)
    user_input = input("You: ")
    # Save input into context
    if current_node.name == "Name":
        ctx['name'] = user_input
    elif current_node.name == "Age":
        ctx['Age'] = int(user_input)
    elif current_node.name == "Sex":
        ctx['Sex'] = user_input
    elif current_node.name == "Pclass":
        ctx['Pclass'] = int(user_input)
    elif current_node.name == "SibSp":
        ctx['SibSp'] = int(user_input)
    elif current_node.name == "Parch":
        ctx['Parch'] = int(user_input)
    elif current_node.name == "Fare":
        ctx['Fare'] = float(user_input)
    elif current_node.name == "Embarked":
        ctx['Embarked'] = user_input.upper()
    
    current_node = current_node.next_nodes[0]
print("Bot:", current_node.run(ctx))