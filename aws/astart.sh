#새로운 .jar 파일을 nohup으로 백그라운드에서 실행
echo "Starting new backend process..."
nohup java -jar /home/ubuntu/arentcar/backend/arentcar-0.0.1-SNAPSHOT.jar > output.log 2>&1 &
echo "Backend started successfully."
