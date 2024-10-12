web: sh -c "cd frontend && npm install && npm run build && cd ../backend && python manage.py collectstatic --no-input  && gunicorn backend.wsgi --log-file -"
