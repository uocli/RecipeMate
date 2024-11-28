# Recipe Mate

**Recipe Mate** is a powerful, AI-driven recipe generator designed to create personalized meal plans and grocery lists based on users’ dietary preferences and available
ingredients.

## Features

- 🥘 **Personalized Recipes**: Generate recipes based on dietary preferences and available ingredients.
- 🛒 **Grocery List Generation**: Automatically create grocery lists for selected recipes.
- 🤖 **AI-Powered Recommendations**: Use generative AI to suggest meals tailored to users’ needs.
- 📱 **Responsive Design**: Accessible on both desktop and mobile devices.
- 🔒 **Secure User Authentication**: Sign up or log in to manage recipes and meal plans.

## Technologies Used

- **Frontend**: [React.js](https://react.dev) with [Material UI](https://mui.com) for styling.
- **Backend**: [Django](https://www.djangoproject.com) REST Framework for API development.
- **Database**: PostgreSQL for efficient data storage.
- **AI Integration**: Powered by generative AI for recipe creation.
- **Deployment**: Hosted on Heroku.

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.x

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/uocli/RecipeMate.git
    cd RecipeMate
    ```

2. Set up the backend (Django):
   ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # For Windows: venv\Scripts\activate
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```
   
3. Set up the frontend (React):
    ```bash
   cd ../frontend
    npm install
    npm build
    ```
   
4. Open `http://localhost:8000` in your browser to view the app.

### Usage
1.	Sign up or log in to your account.
2.	Input your available ingredients or dietary preferences.
3.	Browse and select recipes from the generated list.
4.	Generate a grocery list for selected recipes.
5.	Optionally, arrange grocery delivery.

## Project Structure
```bash
RecipeMate/
├── backend/
│   ├── manage.py
│   ├── settings.py
│   ├── models.py
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Contributing
We welcome contributions! Follow these steps to contribute:
1.	Fork the repository.
2.	Create a new branch (git checkout -b feature-name).
3.	Make your changes and commit them (git commit -m 'Add feature').
4.	Push to the branch (git push origin feature-name).
5.	Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact
For any inquiries or feedback, please contact the team members or create an issue on GitHub. 

GitHub Issues: [Create an issue](https://github.com/uocli/RecipeMate/issues/new)

Our Development Team:

| Name     | Email               |
|----------|---------------------|
| Mingzhao | myu058@uottawa.ca   |
| Xinye    | xzhu019@uottawa.ca  |
| Pouria   | pbahr076@uottawa.ca |
| Chenyang | cli049@uottawa.ca   |


