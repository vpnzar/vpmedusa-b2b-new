cd /home/vpnaz/projects/medusaStore

echo "🚀 START FRONT"
cd storefront
npm run dev &
cd ..

echo "🧠 START BACK LOGS"
docker logs -f medusa_backend