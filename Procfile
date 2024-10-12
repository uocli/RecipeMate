web: sh -c "cd frontend && npm install && npm run build && cd ../backend && python manage.py collectstatic --noinput && gunicorn myproject.wsgi --log-file -"
