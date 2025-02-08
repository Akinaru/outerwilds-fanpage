# Dialogue System Documentation

## Basic Structure
All dialogues must follow this structure:
```javascript
export const dialogueName = {
    "start": {
        text: "Your dialogue text here",
        responses: []
    }
};
```

## Features

### 1. Simple Node
Simplest form of dialogue with no responses:
```javascript
"start": {
    text: "This is a simple message",
    responses: []
}
```

### 2. Node with Responses
When you want to give choices:
```javascript
"start": {
    text: "What's your choice?",
    responses: [
        {
            text: "First choice",
            nextId: "first_choice"
        },
        {
            text: "Second choice",
            nextId: "second_choice"
        }
    ]
}
```

### 3. Auto-Next Node
To automatically chain to next dialogue:
```javascript
"start": {
    text: "This will auto-continue...",
    responses: [],
    autoNext: "next_node"
}
```

## Complete Example
```javascript
export const exampleDialogue = {
    "start": {
        text: "*adjusts telescope* Hello explorer!",
        responses: [
            {
                text: "Hello!",
                nextId: "greeting"
            },
            {
                text: "Goodbye",
                nextId: "farewell"
            }
        ]
    },
    "greeting": {
        text: "Nice to meet you!",
        responses: [],
        autoNext: "question"
    },
    "question": {
        text: "Would you like to see something interesting?",
        responses: [
            {
                text: "Yes please!",
                nextId: "show"
            },
            {
                text: "Maybe later",
                nextId: "farewell"
            }
        ]
    },
    "show": {
        text: "*points at stars* Beautiful, isn't it?",
        responses: []
    },
    "farewell": {
        text: "Safe travels!",
        responses: []
    }
};
```

## Tips
- Always start with a "start" node
- Empty `responses` array ends the dialogue
- Use `autoNext` when you want automatic progression
- Use asterisks (*) for actions/emotions: "*smiles*"