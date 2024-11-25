-- Create Recipe table for SQLite
CREATE TABLE api_recipe (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    user_id INTEGER NOT NULL,
    ingredients TEXT DEFAULT '[]',  -- JSON stored as TEXT in SQLite
    instructions TEXT DEFAULT '[]',  -- JSON stored as TEXT in SQLite
    cooking_time VARCHAR(20) CHECK (
        cooking_time IN ('limited', 'medium', 'Extended')
    ) DEFAULT 'medium',
    difficulty VARCHAR(10) CHECK (
        difficulty IN ('easy', 'medium', 'hard')
    ) DEFAULT 'medium',
    dietary_preference VARCHAR(20) CHECK (
        dietary_preference IN ('vegetarian', 'vegan', 'glutenFree')
        OR dietary_preference IS NULL
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) 
        REFERENCES auth_user(id)
);

-- Create indexes
CREATE INDEX idx_recipe_user ON recipe(user_id);
CREATE INDEX idx_recipe_created_at ON recipe(created_at DESC);

We can access the admin page via https://recipemate.uocli.me/admin/ or https://qa.recipemate.uocli.me/admin/ for qa. There is an existing admin user already, feel free to use it for data importing or so:
un: admin
pw: ao!min

hk1234@23901286y