-- Create Favorite table for SQLite
CREATE TABLE api_favorite (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name VARCHAR(255) DEFAULT "Unnamed Recipe",
    ingredients TEXT DEFAULT "Unnamed Recipe ingredients",
    recipe TEXT DEFAULT "Unnamed Recipe recipe",
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) 
        REFERENCES auth_user(id)
);

-- Create indexes
CREATE INDEX idx_favorite_user ON favorite(user_id);
CREATE INDEX idx_favorite_added_at ON favorite(added_at DESC);