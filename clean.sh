docker compose down
docker volume rm wepledge_backend_env wepledge_backend_extensions wepledge_db-data wepledge_frontend_extensions wepledge_frontend_nodemodules
docker image rm wepledge-backend wepledge-frontend
rm -Rf ./backend/src/emissions/migrations/0*.py
rm -Rf ./**/**/__pycache__/
