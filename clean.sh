docker compose down
docker volume rm $1_backend_env $1_backend_extensions $1_db-data $1_frontend_extensions $1_frontend_nodemodules
docker image rm $1-backend $1-frontend
rm -Rf ./backend/src/emissions/migrations/0*.py
rm -Rf ./**/**/__pycache__/
