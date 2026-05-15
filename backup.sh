cat << 'EOF' > start-front.sh
#!/bin/bash
cd /home/vpnaz/projects/medusaStore/storefront || exit
npm run dev
exec bash
EOF