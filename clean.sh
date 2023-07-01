PROJECT=${1:-wepledge}
echo "Deleting containers and networks..."
docker compose -p $PROJECT down
echo "Deleting volumes..."
echo ${PROJECT}_backend_env
docker volume rm ${PROJECT}_backend_env ${PROJECT}_backend_extensions ${PROJECT}_db_data ${PROJECT}_frontend_extensions ${PROJECT}_frontend_nodemodules
echo "Deleting images..."
docker image rm $PROJECT-backend $PROJECT-frontend
echo "Deleting django migrations in ./backend/src/emissions/migrations ..."
rm -Rf ./backend/src/emissions/migrations/0*.py
rm -Rf ./**/**/__pycache__/
