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
## Views and URLs
As we are working as a team, if we build functions on top of the same views `api/views.py` urls `api/urls.py`
or serializers `api/serializers.py` conflicts may arise when we make a pull request since we are working on the same files, sometimes even the same lines.

To avoid this, we introduced a custom_views and custom_urls directories to manage smaller views and urls.
The main views and urls are still in the `views.py` and `urls.py` files. But creating your own views and urls
in the custom_views and custom_urls directories is highly recommended and will help you avoid any code conflicts.
Let's take the token views as an example.

There are three urls related to the token functions.
- ObtainAuthToken
- VerifyAuthToken
- RefreshAuthToken

We can definitely implement these views and urls in the main `views.py` and `urls.py` files.
But it is better to create a new file to manage them in the `custom_views` and `custom_urls` directories.

The main urls.py file will look like this:
```python
from django.urls import path, include

urlpatterns = [
    # ...
    path("token/", include("auth.custom_urls.token_urls")),
    # ...
]
```
While in the `custom_urls/token_urls.py` file, we will have:
```python
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from ..custom_views.token_views import VerifyTokenView

urlpatterns = [
    path("", TokenObtainPairView.as_view(), name="token_obtain"),
    path("verify/", VerifyTokenView.as_view(), name="token_verify"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
```
We can now have smaller views for different tasks.
This gives us the flexibility to work on different tasks without conflicts.
Moreover, it makes the code more readable and maintainable.
```text
custom_views
	|-- __init__.py
	|-- csrf_token_view.py
	|-- login_view.py
	|-- registration_view.py
	|-- token_views.py
```

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