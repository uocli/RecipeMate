# Recipe Mate
## Description
The project is a group assignment of course GNG5300[A].
- It is developed using Django and React.
- The UI is designed using [Material-UI](https://mui.com).
## Installation
- Clone the repository
```bash
git clone https://github.com/uocli/RecipeMate.git
```
- Create a virtual environment
```bash
cd RecipeMate
python3 -m venv venv
```
- Install the Python dependencies
```bash
pip install -r requirements.txt
```
- Install the Node.js dependencies (Make sure you have Node.js installed)
```bash
cd frontend
npm install
```
- Build the frontend
```bash
cd frontend #ignore this if you are already in the frontend directory
npm run build
```
_Note_: If `npm run watch` is working, you can try that out to detect every change within the frontend/src folder. Otherwise, you have to run `npm run build` every time you make a change in the frontend/src folder.
- Run the Django server
```bash
cd ../backend # or cd backend if you are in the root directory
python manage.py runserver
```
If all goes well, you can access the application at `http://127.0.0.1:8000/` locally.

## Development Process
- A User Story is created for each task. The assignee will be responsible for the task.
- The task will be developed in a separate branch. You have different ways of creating a new branch.
  - Create a new branch from the terminal`bash git checkout -b <branch-name>`
  - Create a new branch from the GitHub UI
  - ![](https://cdn.jsdelivr.net/gh/uocli/img@main/2024-11-01/03MatE.png "Create Branch from Dropdown")
  - ![](https://cdn.jsdelivr.net/gh/uocli/img@main/2024-11-01/qxBXtz.png "Create Branch from Button")
- Build the task in the branch.
- Test the task locally.
- Commit the changes to the branch.
  - `git add .`
  - `git commit -m "Commit message"`
  - `git push`
- Once the task is completed, a pull request will be created from the dev branch to the **qa** branch which is pointing to the [qa environment](https://qa.recipemate.uocli.me/).
  - ![](https://cdn.jsdelivr.net/gh/uocli/img@main/2024-11-01/fzurrL.png "Create Pull Request")
- The tester will be performing the testing in the qa environment.
- Once the testing is completed, a pull request will be created from the dev branch to the **main** branch which is pointing to the [production environment](https://recipemate.uocli.me/).